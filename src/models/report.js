import mongoose from "mongoose";

const { Schema } = mongoose;

const ReportSchema = new Schema(
    {
        tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },

        title: { type: String, required: true },
        description: { type: String },
        type: {
            type: String,
            enum: ["security_posture", "compliance", "vulnerability", "custom", "audit"],
            required: true,
        },
        format: { type: String, enum: ["pdf", "csv", "json", "xlsx"], default: "pdf" },

        generatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        generatedAt: { type: Date, default: Date.now },
        scheduled: { type: Boolean, default: false },
        scheduleConfig: {
            cron: { type: String },
            nextRunAt: { type: Date },
            recipients: [{ type: String }],
        },

        dataSummary: { type: Schema.Types.Mixed, default: {} },
        fileUrl: { type: String },
        exportMetadata: { type: Schema.Types.Mixed, default: {} },

        relatedAssets: [{ type: Schema.Types.ObjectId, ref: "Asset" }],
        relatedPolicies: [{ type: Schema.Types.ObjectId, ref: "Policy" }],
        relatedCompliance: [{ type: Schema.Types.ObjectId, ref: "Compliance" }],

        status: { type: String, enum: ["completed", "pending", "failed"], default: "pending" },
        errorMessage: { type: String },

        triggeredByAutomation: { type: Boolean, default: false },
        automationRef: { type: String },
    },
    { timestamps: true }
);

ReportSchema.index({ tenantId: 1, type: 1, generatedAt: -1 });
ReportSchema.index({ status: 1 });

const Report = mongoose.model("Report", ReportSchema);
export default Report;
