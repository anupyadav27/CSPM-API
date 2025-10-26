import mongoose from "mongoose";

const { Schema } = mongoose;

const NotificationSettingsSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", index: true, sparse: true },
        tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },

        enabled: { type: Boolean, default: true },

        channels: {
            inApp: {
                enabled: { type: Boolean, default: true },
                digest: {
                    type: String,
                    enum: ["realtime", "hourly", "daily", "weekly"],
                    default: "realtime",
                },
                severityThreshold: {
                    type: String,
                    enum: ["low", "medium", "high", "critical"],
                    default: "low",
                },
            },
            email: {
                enabled: { type: Boolean, default: true },
                address: { type: String },
                digest: {
                    type: String,
                    enum: ["realtime", "daily", "weekly", "none"],
                    default: "realtime",
                },
                templates: {
                    alertTemplateId: { type: Schema.Types.ObjectId, ref: "NotificationTemplate" },
                },
                severityThreshold: {
                    type: String,
                    enum: ["low", "medium", "high", "critical"],
                    default: "low",
                },
            },
            webhook: {
                enabled: { type: Boolean, default: false },
                url: { type: String },
                headers: { type: Map, of: String },
                auth: { type: Schema.Types.Mixed },
                retryPolicy: {
                    maxAttempts: { type: Number, default: 3 },
                    backoffSeconds: { type: Number, default: 30 },
                },
                severityThreshold: {
                    type: String,
                    enum: ["low", "medium", "high", "critical"],
                    default: "high",
                },
            },
            siem: {
                enabled: { type: Boolean, default: false },
                connectorId: { type: String },
                indexName: { type: String },
                severityThreshold: {
                    type: String,
                    enum: ["low", "medium", "high", "critical"],
                    default: "high",
                },
            },
            slack: {
                enabled: { type: Boolean, default: false },
                channel: { type: String },
                webhookUrl: { type: String },
            },
            pagerDuty: {
                enabled: { type: Boolean, default: false },
                integrationKey: { type: String },
            },
        },

        rules: [
            {
                name: String,
                enabled: { type: Boolean, default: true },
                match: { type: Schema.Types.Mixed },
                actions: { type: Schema.Types.Mixed },
            },
        ],

        lastTestedAt: { type: Date },
        lastTestResult: { type: String },

        metadata: { type: Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);

NotificationSettingsSchema.index({ tenantId: 1, userId: 1 }, { unique: true, sparse: true });
NotificationSettingsSchema.index({ tenantId: 1, "channels.webhook.enabled": 1 });

const NotificationSettings = mongoose.model("NotificationSettings", NotificationSettingsSchema);
export default NotificationSettings;
