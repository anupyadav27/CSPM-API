import mongoose from "mongoose";
const {Schema} = mongoose;

const ThreatSchema = new Schema(
	{
		tenantId: {type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true},
		assetId: {type: Schema.Types.ObjectId, ref: 'Asset', index: true},
		source: {
			type: String,
			enum: ['guardduty', 'security_hub', 'cloudwatch', 'external_feed', 'manual'],
			required: true
		},
		
		title: {type: String, required: true},
		description: {type: String},
		severity: {type: String, enum: ['low', 'medium', 'high', 'critical'], required: true},
		category: {type: String},
		type: {type: String},
		
		detectedAt: {type: Date, default: Date.now},
		lastUpdatedAt: {type: Date, default: Date.now},
		resolvedAt: {type: Date},
		
		status: {type: String, enum: ['active', 'investigating', 'resolved', 'false_positive'], default: 'active'},
		
		confidence: {type: Number, min: 0, max: 100, default: 100},
		region: {type: String},
		
		remediation: {
			steps: [{type: String}],
			automated: {type: Boolean, default: false},
			lambdaActionId: {type: String},
		},
		
		relatedFindings: [{type: String}],
		metadata: {type: Schema.Types.Mixed, default: {}},
	},
	{timestamps: true}
);

ThreatSchema.index({tenantId: 1, severity: 1, status: 1});
ThreatSchema.index({source: 1, detectedAt: -1});
ThreatSchema.index({assetId: 1});

module.exports = mongoose.model('Threat', ThreatSchema);
