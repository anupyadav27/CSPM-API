import mongoose from "mongoose";

const {Schema} = mongoose;

const ComplianceSchema = new Schema(
	{
		tenantId: {type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true},
		framework: {
			type: String,
			enum: ['CIS', 'PCI-DSS', 'ISO27001', 'HIPAA', 'SOC2', 'Custom'],
			required: true
		},
		controlId: {type: String, required: true},
		controlTitle: {type: String, required: true},
		description: {type: String},
		
		resourceIds: [{type: Schema.Types.ObjectId, ref: 'Asset'}],
		
		status: {type: String, enum: ['compliant', 'non_compliant', 'not_applicable', 'unknown'], default: 'unknown'},
		severity: {type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low'},
		
		evidence: {type: Schema.Types.Mixed, default: {}},
		lastCheckedAt: {type: Date, default: Date.now},
		remediatedAt: {type: Date},
		
		remediationSteps: [{type: String}],
		automationId: {type: String},
		notes: {type: String},
		
		metadata: {type: Schema.Types.Mixed, default: {}},
	},
	{timestamps: true}
);

ComplianceSchema.index({tenantId: 1, framework: 1, controlId: 1});
ComplianceSchema.index({status: 1});
ComplianceSchema.index({severity: 1});

const Compliance = mongoose.model('Compliance', ComplianceSchema);
export default Compliance;
