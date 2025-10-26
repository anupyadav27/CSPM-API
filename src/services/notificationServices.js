import mongoose from "mongoose";

import Notification from "../models/notification.js";
import NotificationSettings from "../models/NotificationSettings.js";

const notificationServices = {
    async createNotification(data) {
        const notification = new Notification(data);
        return await notification.save();
    },

    async getNotificationById(id) {
        return await Notification.findById(id);
    },

    async getNotificationsByTenant(tenantId, filters = {}, options = {}) {
        return await Notification.find({ tenantId, ...filters })
            .sort({ createdAt: -1 })
            .limit(options.limit || 100)
            .skip(options.skip || 0);
    },

    async getNotificationsByUser(userId, filters = {}, options = {}) {
        return await Notification.find({ userId, ...filters })
            .sort({ createdAt: -1 })
            .limit(options.limit || 100)
            .skip(options.skip || 0);
    },

    async getNotificationsByTenantAndUser(tenantId, userId, filters = {}, options = {}) {
        return await Notification.find({ tenantId, userId, ...filters })
            .sort({ createdAt: -1 })
            .limit(options.limit || 100)
            .skip(options.skip || 0);
    },

    async getUnreadNotifications(userId, tenantId = null) {
        const query = { userId, read: false };
        if (tenantId) query.tenantId = tenantId;
        return await Notification.find(query).sort({ createdAt: -1 });
    },

    async markAsRead(notificationId, userId) {
        return await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { $set: { read: true, readAt: new Date() } },
            { new: true }
        );
    },

    async markAllAsRead(userId, tenantId = null) {
        const query = { userId, read: false };
        if (tenantId) query.tenantId = tenantId;
        return await Notification.updateMany(query, {
            $set: { read: true, readAt: new Date() },
        });
    },

    async deleteNotification(idOrFilter) {
        if (mongoose.isValidObjectId(idOrFilter)) {
            return await Notification.findByIdAndDelete(idOrFilter);
        } else {
            return await Notification.deleteMany(idOrFilter);
        }
    },

    async updateDeliveryStatus(notificationId, channel, status) {
        const update = {};
        update[`delivery.${channel}`] = {
            attempted: true,
            delivered: status === "delivered",
            lastAttemptedAt: new Date(),
        };
        return await Notification.findByIdAndUpdate(
            notificationId,
            { $set: update },
            { new: true }
        );
    },

    async filterNotifications({ tenantId, userId, category, priority, startDate, endDate }) {
        const query = {};
        if (tenantId) query.tenantId = tenantId;
        if (userId) query.userId = userId;
        if (category) query.category = category;
        if (priority) query.priority = priority;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        return await Notification.find(query).sort({ createdAt: -1 });
    },

    async countUnreadNotifications(userId, tenantId = null) {
        const query = { userId, read: false };
        if (tenantId) query.tenantId = tenantId;
        return await Notification.countDocuments(query);
    },

    async getRecentNotifications(userId, tenantId, limit = 10) {
        return await Notification.find({ userId, tenantId }).sort({ createdAt: -1 }).limit(limit);
    },

    async getUserSettings(userId, tenantId) {
        return await NotificationSettings.findOne({ userId, tenantId });
    },

    async getTenantSettings(tenantId) {
        return await NotificationSettings.find({ tenantId, userId: { $exists: false } });
    },

    async upsertUserSettings(userId, tenantId, settingsData) {
        return await NotificationSettings.findOneAndUpdate(
            { userId, tenantId },
            { $set: settingsData },
            { upsert: true, new: true }
        );
    },

    async toggleChannel(userId, tenantId, channel, enabled) {
        const path = `channels.${channel}.enabled`;
        return await NotificationSettings.findOneAndUpdate(
            { userId, tenantId },
            { $set: { [path]: enabled } },
            { new: true }
        );
    },

    async updateChannelConfig(userId, tenantId, channel, config) {
        const path = `channels.${channel}`;
        return await NotificationSettings.findOneAndUpdate(
            { userId, tenantId },
            { $set: { [path]: config } },
            { new: true }
        );
    },

    async testSettings(userId, tenantId) {
        const settings = await NotificationSettings.findOne({ userId, tenantId });
        if (!settings) throw new Error("Settings not found");
        return { success: true, testedAt: new Date() };
    },

    async resetUserSettings(userId, tenantId) {
        return await NotificationSettings.findOneAndDelete({ userId, tenantId });
    },

    async getAllUserSettingsByTenant(tenantId) {
        return await NotificationSettings.find({ tenantId });
    },

    async aggregateNotifications(tenantId, groupBy = "category") {
        return await Notification.aggregate([
            { $match: { tenantId: new mongoose.Types.ObjectId(tenantId) } },
            { $group: { _id: `$${groupBy}`, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
    },
};

export default notificationServices;
