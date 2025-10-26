import User from "../models/user.js";
import AuditLog from "../models/auditLog.js";
import Role from "../models/role.js";
import runTransaction from "./transactionControl.js";

const userServices = () => {
    const getAllUsers = async (filters = {}, pagination = {}) => {
        try {
            let users, total;

            const query = User.find(filters)
                .sort({ createdAt: -1 })
                .populate({
                    path: "roles",
                    select: "_id name tenantScoped",
                })
                .lean();

            if (pagination.enabled) {
                const { skip, pageSize } = pagination;

                [users, total] = await Promise.all([
                    query.skip(skip).limit(pageSize),
                    User.countDocuments(filters),
                ]);
            } else {
                users = await query;
                total = users.length;
            }

            users = users.map((user) => ({
                ...user,
                roles: user.roles.map((r) => ({
                    roleId: r._id,
                    name: r.name,
                    tenantScoped: r.tenantScoped,
                })),
            }));

            return {
                users,
                pagination: {
                    total,
                    pageSize: pagination.enabled ? pagination.pageSize : total,
                    currentPage: pagination.enabled
                        ? Math.floor(pagination.skip / pagination.pageSize) + 1
                        : 1,
                    totalPages: pagination.enabled ? Math.ceil(total / pagination.pageSize) : 1,
                },
            };
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    };

    const getUserById = async (userId) => {
        try {
            return await User.findById(userId).lean();
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw error;
        }
    };

    const createUser = async (userData, createdBy = null) => {
        return runTransaction(async (session) => {
            const user = new User(userData);
            await user.save({ session });

            await AuditLog.create(
                [
                    {
                        action: "create_user",
                        entityType: "User",
                        entityId: user._id,
                        userId: createdBy,
                        description: `User '${user.email}' created.`,
                        severity: "info",
                        metadata: { userData },
                    },
                ],
                { session }
            );

            return user.toObject();
        });
    };

    const updateUser = async (userId, updates, updatedBy = null) => {
        return runTransaction(async (session) => {
            const oldUser = await User.findById(userId).lean();
            if (!oldUser) throw new Error("User not found");

            const user = await User.findByIdAndUpdate(userId, updates, {
                new: true,
                runValidators: true,
                session,
            }).lean();

            await AuditLog.create(
                [
                    {
                        action: "update_user",
                        entityType: "User",
                        entityId: user._id,
                        userId: updatedBy,
                        description: `User '${user.email}' updated.`,
                        severity: "info",
                        metadata: { before: oldUser, after: user },
                    },
                ],
                { session }
            );

            return user;
        });
    };

    const deleteUser = async (userId, deletedBy = null, softDelete = false) => {
        return runTransaction(async (session) => {
            let user;

            if (softDelete) {
                user = await User.findByIdAndUpdate(
                    userId,
                    { status: "inactive" },
                    { new: true, session }
                ).lean();
            } else {
                user = await User.findByIdAndDelete(userId, { session }).lean();
            }

            if (!user) throw new Error("User not found");

            await AuditLog.create(
                [
                    {
                        action: softDelete ? "soft_delete_user" : "delete_user",
                        entityType: "User",
                        entityId: user._id,
                        userId: deletedBy,
                        description: `User '${user.email}' ${softDelete ? "soft-deleted" : "deleted"}.`,
                        severity: softDelete ? "warning" : "critical",
                        metadata: { userId },
                    },
                ],
                { session }
            );

            return user;
        });
    };

    const recordLogin = async (userId, ip, userAgent, recordedBy = null) => {
        return runTransaction(async (session) => {
            const update = {
                lastLogin: new Date(),
                $push: {
                    loginHistory: {
                        timestamp: new Date(),
                        ip,
                        userAgent,
                    },
                },
            };

            const user = await User.findByIdAndUpdate(userId, update, {
                new: true,
                session,
            }).lean();

            await AuditLog.create(
                [
                    {
                        action: "record_login",
                        entityType: "User",
                        entityId: user._id,
                        userId: recordedBy || user._id,
                        description: `User '${user.email}' logged in.`,
                        severity: "info",
                        metadata: { ip, userAgent },
                    },
                ],
                { session }
            );

            return user;
        });
    };

    const getUserByEmail = async (email) => {
        try {
            const filters = { email: email.toLowerCase().trim() };

            return await User.findOne(filters).lean();
        } catch (error) {
            console.error("Error fetching user by email:", error);
            throw error;
        }
    };

    const updatePreferences = async (userId, preferences, updatedBy = null) => {
        return runTransaction(async (session) => {
            const oldUser = await User.findById(userId).lean();
            if (!oldUser) throw new Error("User not found");

            const user = await User.findByIdAndUpdate(
                userId,
                { preferences },
                { new: true, runValidators: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "update_user_preferences",
                        entityType: "User",
                        entityId: user._id,
                        userId: updatedBy,
                        description: `User '${user.email}' preferences updated.`,
                        severity: "info",
                        metadata: { before: oldUser.preferences, after: preferences },
                    },
                ],
                { session }
            );

            return user;
        });
    };

    return {
        getAllUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
        recordLogin,
        updatePreferences,
        getUserByEmail,
    };
};

export default userServices;
