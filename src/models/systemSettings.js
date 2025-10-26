import mongoose from "mongoose";

const { Schema } = mongoose;

const SystemSettingsSchema = new Schema(
    {
        tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", default: null, index: true },
        scope: { type: String, enum: ["global", "tenant"], default: "global" },

        platformName: { type: String, default: "Cloud Secure Platform" },
        supportEmail: { type: String, default: "support@example.com" },
        timezone: { type: String, default: "UTC" },
        locale: { type: String, default: "en-US" },

        featureFlags: {
            type: Map,
            of: Boolean,
            default: {
                enableVulnerabilityScan: true,
                enableThreatDetection: true,
                enableComplianceMonitoring: true,
                enableAutoRemediation: false,
            },
        },

        security: {
            passwordPolicy: {
                minLength: { type: Number, default: 8 },
                requireNumbers: { type: Boolean, default: true },
                requireSymbols: { type: Boolean, default: true },
                expireDays: { type: Number, default: 90 },
            },
            sessionTimeoutMinutes: { type: Number, default: 60 },
            maxFailedLoginAttempts: { type: Number, default: 5 },
            mfaRequired: { type: Boolean, default: false },
        },

        integrations: {
            aws: {
                accessKeyId: { type: String },
                secretAccessKey: { type: String },
                regions: [{ type: String }],
            },
            azure: { clientId: String, clientSecret: String, subscriptionId: String },
            gcp: { projectId: String, keyFile: String },
        },

        alertThresholds: {
            cpuUsage: { type: Number, default: 85 },
            memoryUsage: { type: Number, default: 90 },
            vulnerabilityCriticalCount: { type: Number, default: 10 },
        },

        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
        notes: { type: String },
    },
    { timestamps: true }
);

SystemSettingsSchema.index({ tenantId: 1, scope: 1 });

const SystemSettings = mongoose.model("SystemSettings", SystemSettingsSchema);
export default SystemSettings;
