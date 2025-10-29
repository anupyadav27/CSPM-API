import Notification from "../models/notification.js";
import NotificationSettings from "../models/notificationSettings.js";
import AuditLog from "../models/auditLog.js";
import runTransaction from "./transactionControl.js";

const notificationServices = () => {
    const getAllNotifications = async (filters = {}, pagination = {}) => {
        try {
            let notifications, total;

            const query = Notification.find(filters)
                .sort({ createdAt: -1 })
                .populate({ path: "userId", select: "_id email" })
                .populate({ path: "tenantId", select: "_id name" })
                .lean();

            if (pagination.enabled) {
                const { skip, pageSize } = pagination;
                [notifications, total] = await Promise.all([
                    query.skip(skip).limit(pageSize),
                    Notification.countDocuments(filters),
                ]);
            } else {
                notifications = await query;
                total = notifications.length;
            }

            return {
                notifications,
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
            console.error("Error fetching notifications:", error);
            throw error;
        }
    };

    const getAllNotificationsByTenantId = async (tenantId, filters = {}, pagination = {}) => {
        try {
            const combinedFilters = { tenantId, ...filters };
            return await getAllNotifications(combinedFilters, pagination);
        } catch (error) {
            console.error("Error fetching notifications by tenantId:", error);
            throw error;
        }
    };

    const getAllNotificationsByUserId = async (userId, filters = {}, pagination = {}) => {
        try {
            const combinedFilters = { userId, ...filters };
            return await getAllNotifications(combinedFilters, pagination);
        } catch (error) {
            console.error("Error fetching notifications by userId:", error);
            throw error;
        }
    };

    const getAllUnreadNotifications = async (filters = {}, pagination = {}) => {
        try {
            const unreadFilters = { read: false, ...filters };
            return await getAllNotifications(unreadFilters, pagination);
        } catch (error) {
            console.error("Error fetching unread notifications:", error);
            throw error;
        }
    };

    const getNotificationStats = async (filters = {}) => {
        try {
            const [total, unread] = await Promise.all([
                Notification.countDocuments(filters),
                Notification.countDocuments({ ...filters, read: false }),
            ]);

            return {
                totalNotifications: total,
                unreadNotifications: unread,
            };
        } catch (error) {
            console.error("Error fetching notification stats:", error);
            throw error;
        }
    };

    const getNotificationById = async (id) => {
        try {
            return await Notification.findById(id)
                .populate("userId", "_id email")
                .populate("tenantId", "_id name")
                .lean();
        } catch (error) {
            console.error("Error fetching notification by ID:", error);
            throw error;
        }
    };

    const createNotification = async (data, createdBy = null) => {
        return runTransaction(async (session) => {
            const notification = new Notification(data);
            await notification.save({ session });

            await AuditLog.create(
                [
                    {
                        action: "create_notification",
                        entityType: "Notification",
                        entityId: notification._id,
                        userId: createdBy,
                        description: `Notification '${notification.title}' created.`,
                        severity: "info",
                        metadata: { data },
                    },
                ],
                { session }
            );

            return notification.toObject();
        });
    };

    const createBulkNotifications = async (notificationsData, createdBy = null) => {
        return runTransaction(async (session) => {
            const inserted = await Notification.insertMany(notificationsData, { session });

            await AuditLog.create(
                [
                    {
                        action: "create_bulk_notifications",
                        entityType: "Notification",
                        userId: createdBy,
                        description: `Bulk notifications created (${inserted.length} total).`,
                        severity: "info",
                        metadata: { count: inserted.length },
                    },
                ],
                { session }
            );

            return inserted.map((n) => n.toObject());
        });
    };

    const updateNotification = async (id, updates, updatedBy = null) => {
        return runTransaction(async (session) => {
            const old = await Notification.findById(id).lean();
            if (!old) throw new Error("Notification not found");

            const updated = await Notification.findByIdAndUpdate(id, updates, {
                new: true,
                session,
            }).lean();

            await AuditLog.create(
                [
                    {
                        action: "update_notification",
                        entityType: "Notification",
                        entityId: updated._id,
                        userId: updatedBy,
                        description: `Notification '${updated.title}' updated.`,
                        severity: "info",
                        metadata: { before: old, after: updated },
                    },
                ],
                { session }
            );

            return updated;
        });
    };

    const deleteNotification = async (id, deletedBy = null) => {
        return runTransaction(async (session) => {
            const deleted = await Notification.findByIdAndDelete(id, { session }).lean();
            if (!deleted) throw new Error("Notification not found");

            await AuditLog.create(
                [
                    {
                        action: "delete_notification",
                        entityType: "Notification",
                        entityId: id,
                        userId: deletedBy,
                        description: `Notification '${deleted.title}' deleted.`,
                        severity: "critical",
                    },
                ],
                { session }
            );

            return deleted;
        });
    };

    const markAsRead = async (id, userId) => {
        return runTransaction(async (session) => {
            const notification = await Notification.findByIdAndUpdate(
                id,
                { read: true, readAt: new Date() },
                { new: true, session }
            ).lean();

            if (!notification) throw new Error("Notification not found");

            await AuditLog.create(
                [
                    {
                        action: "mark_notification_read",
                        entityType: "Notification",
                        entityId: notification._id,
                        userId,
                        description: `Notification '${notification.title}' marked as read.`,
                        severity: "info",
                    },
                ],
                { session }
            );

            return notification;
        });
    };

    const markAllAsReadForUser = async (userId) => {
        return runTransaction(async (session) => {
            const result = await Notification.updateMany(
                { userId, read: false },
                { read: true, readAt: new Date() },
                { session }
            );

            await AuditLog.create(
                [
                    {
                        action: "mark_all_notifications_read",
                        entityType: "Notification",
                        userId,
                        description: `All notifications marked as read for user ${userId}.`,
                        severity: "info",
                    },
                ],
                { session }
            );

            return result.modifiedCount;
        });
    };

    const recordDeliveryAttempt = async (id, channel, success, extra = {}) => {
        return runTransaction(async (session) => {
            const updatePath = `delivery.${channel}`;
            const update = {
                [`${updatePath}.attempted`]: true,
                [`${updatePath}.lastAttemptedAt`]: new Date(),
                $inc: { [`${updatePath}.attempts`]: 1 },
            };

            if (success) {
                update[`${updatePath}.delivered`] = true;
                update[`${updatePath}.error`] = null;
            } else if (extra.error) {
                update[`${updatePath}.error`] = extra.error;
            }

            if (extra.status) {
                update[`${updatePath}.lastResponseStatus`] = extra.status;
            }

            const notification = await Notification.findByIdAndUpdate(id, update, {
                new: true,
                session,
            }).lean();

            return notification;
        });
    };

    const getSettings = async (tenantId, userId = null) => {
        try {
            return await NotificationSettings.findOne({ tenantId, userId }).lean();
        } catch (error) {
            console.error("Error fetching notification settings:", error);
            throw error;
        }
    };

    const upsertSettings = async (tenantId, userId, data, updatedBy = null) => {
        return runTransaction(async (session) => {
            const settings = await NotificationSettings.findOneAndUpdate(
                { tenantId, userId },
                data,
                { new: true, upsert: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "upsert_notification_settings",
                        entityType: "NotificationSettings",
                        entityId: settings._id,
                        userId: updatedBy,
                        description: `Notification settings updated for tenant ${tenantId}, user ${userId}.`,
                        severity: "info",
                    },
                ],
                { session }
            );

            return settings;
        });
    };

    const disableNotificationsForUser = async (tenantId, userId) => {
        return runTransaction(async (session) => {
            const settings = await NotificationSettings.findOneAndUpdate(
                { tenantId, userId },
                { enabled: false },
                { new: true, session }
            ).lean();

            await AuditLog.create(
                [
                    {
                        action: "disable_notifications",
                        entityType: "NotificationSettings",
                        entityId: settings?._id,
                        userId,
                        description: `Notifications disabled for user ${userId} in tenant ${tenantId}.`,
                        severity: "warning",
                    },
                ],
                { session }
            );

            return settings;
        });
    };

    const deleteExpiredNotifications = async () => {
        try {
            const now = new Date();
            const result = await Notification.deleteMany({ expiresAt: { $lte: now } });
            return result.deletedCount;
        } catch (error) {
            console.error("Error deleting expired notifications:", error);
            throw error;
        }
    };

    return {
        getAllNotifications,
        getAllNotificationsByTenantId,
        getAllNotificationsByUserId,
        getAllUnreadNotifications,
        getNotificationStats,
        getNotificationById,
        createNotification,
        createBulkNotifications,
        updateNotification,
        deleteNotification,
        markAsRead,
        markAllAsReadForUser,
        recordDeliveryAttempt,
        getSettings,
        upsertSettings,
        disableNotificationsForUser,
        deleteExpiredNotifications,
    };
};

export default notificationServices;
