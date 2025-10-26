import mongoose from "mongoose";

import User from "../models/user.js";
import Role from "../models/role.js";
import Permission from "../models/permission.js";
import TenantUser from "../models/tenantUser.js";
import AuditLog from "../models/auditLog.js";

const runTransaction = async (operations) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const result = await operations(session);
        await session.commitTransaction();
        return result;
    } catch (error) {
        await session.abortTransaction();
        console.error("RBAC transaction failed:", error);
        throw error;
    } finally {
        await session.endSession();
    }
};

const rbacServices = () => {
    const createRole = async (roleData, createdBy) => {
        return runTransaction(async (session) => {
            const role = new Role({ ...roleData, createdBy });
            await role.save({ session });

            await AuditLog.create(
                [
                    {
                        action: "create_role",
                        entityType: "Role",
                        entityId: role._id,
                        userId: createdBy,
                        description: `Role '${role.name}' created.`,
                        severity: "info",
                        metadata: { roleData },
                    },
                ],
                { session }
            );

            return role;
        });
    };

    const updateRole = async (roleId, updates, updatedBy) => {
        return runTransaction(async (session) => {
            const role = await Role.findByIdAndUpdate(roleId, updates, { new: true, session });
            if (!role) throw new Error("Role not found");

            await AuditLog.create(
                [
                    {
                        action: "update_role",
                        entityType: "Role",
                        entityId: role._id,
                        userId: updatedBy,
                        description: `Role '${role.name}' updated.`,
                        severity: "info",
                        metadata: { updates },
                    },
                ],
                { session }
            );

            return role;
        });
    };

    const deleteRole = async (roleId, deletedBy) => {
        return runTransaction(async (session) => {
            const role = await Role.findById(roleId);
            if (!role) throw new Error("Role not found");

            await Role.deleteOne({ _id: roleId }, { session });
            await AuditLog.create(
                [
                    {
                        action: "delete_role",
                        entityType: "Role",
                        entityId: role._id,
                        userId: deletedBy,
                        description: `Role '${role.name}' deleted.`,
                        severity: "warning",
                        metadata: { deletedRole: role },
                    },
                ],
                { session }
            );

            return true;
        });
    };

    const getAllRoles = async (filter = {}) => {
        return Role.find(filter).lean();
    };

    const createPermission = async (permissionData, createdBy) => {
        return runTransaction(async (session) => {
            const permission = new Permission({ ...permissionData, createdBy });
            await permission.save({ session });

            await AuditLog.create(
                [
                    {
                        action: "create_permission",
                        entityType: "Permission",
                        entityId: permission._id,
                        userId: createdBy,
                        description: `Permission '${permission.key}' created.`,
                        severity: "info",
                        metadata: { permissionData },
                    },
                ],
                { session }
            );

            return permission;
        });
    };

    const assignPermissionsToRole = async (roleId, permissionIds, updatedBy) => {
        return runTransaction(async (session) => {
            const role = await Role.findById(roleId).session(session);
            if (!role) throw new Error("Role not found");

            const existingIds = new Set(role.permissions.map((p) => p.toString()));
            const newIds = permissionIds.filter((p) => !existingIds.has(p.toString()));
            if (newIds.length === 0) throw new Error("No new permissions to assign.");

            role.permissions = [...existingIds, ...newIds];
            await role.save({ session });

            const newPermissions = await Permission.find({ _id: { $in: newIds } })
                .select("key feature action")
                .lean();

            await AuditLog.create(
                [
                    {
                        action: "assign_permissions",
                        entityType: "Role",
                        entityId: role._id,
                        userId: updatedBy,
                        description: `Permissions [${newPermissions.map((p) => `${p.feature}:${p.action}`).join(", ")}] assigned to role '${role.name}'.`,
                        severity: "info",
                        metadata: { addedPermissions: newPermissions },
                    },
                ],
                { session }
            );

            return role;
        });
    };

    const removePermissionFromRole = async (roleId, permissionId, updatedBy) => {
        return runTransaction(async (session) => {
            const role = await Role.findById(roleId).session(session);
            if (!role) throw new Error("Role not found");

            const removedPermission = await Permission.findById(permissionId).lean();
            role.permissions = role.permissions.filter(
                (p) => p.toString() !== permissionId.toString()
            );
            await role.save({ session });

            await AuditLog.create(
                [
                    {
                        action: "remove_permission",
                        entityType: "Role",
                        entityId: role._id,
                        userId: updatedBy,
                        description: `Permission '${removedPermission?.feature}:${removedPermission?.action}' removed from role '${role.name}'.`,
                        severity: "warning",
                        metadata: { removedPermission },
                    },
                ],
                { session }
            );

            return role;
        });
    };

    const assignRoleToUser = async (tenantId, userId, roles, updatedBy) => {
        return runTransaction(async (session) => {
            let tenantUser = await TenantUser.findOne({ tenantId, userId }).session(session);
            if (!tenantUser) {
                tenantUser = new TenantUser({ tenantId, userId, roles });
            } else {
                tenantUser.roles = [...new Set([...tenantUser.roles, ...roles])];
            }
            await tenantUser.save({ session });

            await AuditLog.create(
                [
                    {
                        action: "assign_role",
                        entityType: "TenantUser",
                        entityId: tenantUser._id,
                        userId: updatedBy,
                        description: `Roles [${roles.join(", ")}] assigned to user ${userId} in tenant ${tenantId}.`,
                        severity: "info",
                        metadata: { tenantId, userId, addedRoles: roles },
                    },
                ],
                { session }
            );

            return tenantUser;
        });
    };

    const revokeRoleFromUser = async (tenantId, userId, role, updatedBy) => {
        return runTransaction(async (session) => {
            const tenantUser = await TenantUser.findOne({ tenantId, userId }).session(session);
            if (!tenantUser) throw new Error("Tenant user not found");

            const previousRoles = [...tenantUser.roles];
            tenantUser.roles = tenantUser.roles.filter((r) => r !== role);
            await tenantUser.save({ session });

            await AuditLog.create(
                [
                    {
                        action: "revoke_role",
                        entityType: "TenantUser",
                        entityId: tenantUser._id,
                        userId: updatedBy,
                        description: `Role '${role}' revoked from user ${userId} in tenant ${tenantId}.`,
                        severity: "warning",
                        metadata: {
                            tenantId,
                            userId,
                            revokedRole: role,
                            previousRoles,
                            currentRoles: tenantUser.roles,
                        },
                    },
                ],
                { session }
            );

            return tenantUser;
        });
    };

    const checkUserPermission = async (userId, tenantId, feature, action) => {
        const user = await User.findById(userId).lean();
        if (!user) throw new Error("User not found");

        const tenantUser = await TenantUser.findOne({ tenantId, userId }).populate({
            path: "roles",
            populate: { path: "permissions" },
        });

        const userRoles = tenantUser?.roles || [];

        if (user.roles.includes("super_admin")) return true;

        const allPermissions = new Set();
        for (const role of userRoles) {
            const roleDetails = await Role.findById(role).populate("permissions");
            if (roleDetails?.permissions) {
                roleDetails.permissions.forEach((p) =>
                    allPermissions.add(`${p.feature}:${p.action}`)
                );
            }
        }

        return allPermissions.has(`${feature}:${action}`);
    };

    const getUserRoles = async (userId, tenantId) => {
        const tenantUser = await TenantUser.findOne({ tenantId, userId }).populate("roles");
        return tenantUser ? tenantUser.roles : [];
    };
    const getRolePermissions = async (roleId) => {
        const role = await Role.findById(roleId).populate("permissions");
        return role ? role.permissions : [];
    };
};

export default rbacServices;
