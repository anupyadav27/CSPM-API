import mongoose from "mongoose";

const { Schema } = mongoose;

const secopsSchema = new Schema(
    {
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Tenant",
        },
        project: { type: String, required: true },
        repository: { type: String, required: true },
        branch: { type: String },
        commitId: { type: String },
        tool: { type: String, required: true },
        reportType: { type: String, required: true, enum: ["bug", "vulnerability", "code_smell"] },
        ruleId: { type: String },
        ruleName: { type: String },
        severity: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            required: true,
        },
        type: { type: String },
        status: { type: String, enum: ["open", "resolved"], default: "open" },
        issueKey: { type: String, unique: true },
        filePath: { type: String },
        line: { type: Number },
        introducedAt: { type: Date, default: Date.now },
        fixedAt: { type: Date },
        tags: [{ type: String }],
        owner: { type: String },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

const SecOps = mongoose.model("SecOps", secopsSchema);
export default SecOps;
