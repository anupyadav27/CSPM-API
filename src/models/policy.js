import mongoose from "mongoose";
const {Schema} = mongoose;

const PolicySchema = new Schema(
	{
		tenantId: {type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true},
		
		name: {type: String, required: true, index: true},
		description: {type: String},
		category: {
			type: String,
			enum: ['IAM', 'SCP', 'SecurityHub', 'ConfigRule', 'Custom'],
			default: 'Custom'
		},
		type: {type: String, default: 'json'},
		
		document: {type: Schema.Types.Mixed, required: true},
		version: {type: Number, default: 1},
		previousVersions: [
			{
				version: Number,
				document: Schema.Types.Mixed,
				updatedAt: Date,
				updatedBy: {type: Schema.Types.ObjectId, ref: 'User'},
			},
		],
		
		validationStatus: {type: String, enum: ['valid', 'warning', 'error', 'unknown'], default: 'unknown'},
		complianceStatus: {type: String, enum: ['compliant', 'non_compliant', 'unknown'], default: 'unknown'},
		
		enforcedBy: {type: String, enum: ['IAM', 'Config', 'SecurityHub', 'Manual'], default: 'Manual'},
		enforcementStatus: {
			type: String,
			enum: ['enforced', 'not_enforced', 'partially_enforced'],
			default: 'not_enforced'
		},
		enforcementLogs: [
			{
				timestamp: Date,
				result: {type: String},
				triggeredBy: {type: Schema.Types.ObjectId, ref: 'User'},
			},
		],
		
		linkedAssets: [{type: Schema.Types.ObjectId, ref: 'Asset'}],
		linkedComplianceControls: [{type: Schema.Types.ObjectId, ref: 'Compliance'}],
		
		createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
		updatedBy: {type: Schema.Types.ObjectId, ref: 'User'},
		lastEvaluatedAt: {type: Date, default: Date.now},
	},
	{timestamps: true}
);

PolicySchema.index({tenantId: 1, category: 1, name: 1});
PolicySchema.index({complianceStatus: 1, enforcementStatus: 1});

module.exports = mongoose.model('Policy', PolicySchema);
