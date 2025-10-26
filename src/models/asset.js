import mongoose from "mongoose";

const { Schema } = mongoose;

const AssetSchema = new Schema(
    {
        tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },

        name: { type: String, required: true },
        resourceId: { type: String, required: true, index: true },
        resourceType: { type: String, required: true },
        provider: { type: String, enum: ["aws", "azure", "gcp", "on_prem"], default: "aws" },
        region: { type: String },

        tags: { type: Map, of: String },
        environment: {
            type: String,
            enum: ["production", "staging", "development", "test"],
            default: "production",
        },
        category: { type: String },

        createdAtCloud: { type: Date },
        lifecycleState: {
            type: String,
            enum: ["active", "inactive", "terminated", "decommissioned"],
            default: "active",
        },
        lastScannedAt: { type: Date },

        healthStatus: {
            type: String,
            enum: ["healthy", "warning", "critical", "unknown"],
            default: "unknown",
        },
        metrics: { type: Schema.Types.Mixed, default: {} },

        metadata: { type: Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);

AssetSchema.index({ tenantId: 1, resourceId: 1, resourceType: 1 });
AssetSchema.index({ region: 1, environment: 1 });
AssetSchema.index({ lifecycleState: 1, healthStatus: 1 });

const Asset = mongoose.model("Asset", AssetSchema);
export default Asset;
