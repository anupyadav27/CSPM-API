import mongoose from "mongoose";

const { Schema } = mongoose;

const NotificationSchema = new Schema(
    {
        tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", index: true },

        userId: { type: Schema.Types.ObjectId, ref: "User", index: true },

        title: { type: String, required: true, trim: true },
        body: { type: String, required: true },
        category: {
            type: String,
            enum: ["alert", "update", "system", "remediation", "policy"],
            default: "alert",
            index: true,
        },

        channels: [{ type: String }],

        read: { type: Boolean, default: false, index: true },
        readAt: { type: Date },

        priority: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "medium",
            index: true,
        },
        severityScore: { type: Number, default: 0 },

        externalId: { type: String, index: true },
        correlationId: { type: String, index: true },

        delivery: {
            email: {
                attempted: { type: Boolean, default: false },
                delivered: { type: Boolean, default: false },
                lastAttemptedAt: Date,
                attempts: { type: Number, default: 0 },
                error: String,
            },
            webhook: {
                attempted: { type: Boolean, default: false },
                delivered: { type: Boolean, default: false },
                lastAttemptedAt: Date,
                attempts: { type: Number, default: 0 },
                lastResponseStatus: Number,
                error: String,
            },
            siem: {
                attempted: { type: Boolean, default: false },
                delivered: { type: Boolean, default: false },
                lastAttemptedAt: Date,
                attempts: { type: Number, default: 0 },
                error: String,
            },
        },

        source: {
            type: String,
            default: "system",
            index: true,
        },

        action: {
            type: {
                type: String,
            },
            url: String,
            payload: Schema.Types.Mixed,
        },

        expiresAt: { type: Date, index: true },

        payload: { type: Schema.Types.Mixed, default: {} },
        metadata: { type: Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);

NotificationSchema.index({ tenantId: 1, userId: 1, createdAt: -1 });
NotificationSchema.index({ tenantId: 1, read: 1, priority: -1, createdAt: -1 });
NotificationSchema.index({ externalId: 1, source: 1 });

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
