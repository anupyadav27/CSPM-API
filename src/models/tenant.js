import mongoose from "mongoose";

const {Schema} = mongoose;

const TenantSchema = new Schema(
	{
		name: {type: String, required: true, trim: true},
		description: {type: String, trim: true},
		
		status: {
			type: String,
			enum: ['active', 'inactive', 'pending', 'suspended'],
			default: 'active',
		},
		
		plan: {
			type: String,
			enum: ['free', 'standard', 'enterprise'],
			default: 'standard',
		},
		
		contactEmail: {type: String, trim: true},
		logoUrl: {type: String},
		region: {type: String, default: 'us-east-1'},
		
		settings: {
			branding: {
				themeColor: {type: String, default: '#5F9C45'},
				logo: {type: String},
			},
			security: {
				passwordPolicy: {type: Schema.Types.Mixed, default: {}},
				ssoEnabled: {type: Boolean, default: false},
			},
			integrations: {
				aws: {type: Schema.Types.Mixed, default: {}},
				slack: {type: Schema.Types.Mixed, default: {}},
				siem: {type: Schema.Types.Mixed, default: {}},
			},
		},
		
		billing: {
			subscriptionId: {type: String},
			planStartDate: {type: Date},
			planEndDate: {type: Date},
			paymentStatus: {
				type: String,
				enum: ['active', 'overdue', 'cancelled'],
				default: 'active',
			},
		},
		
		metadata: {
			type: Schema.Types.Mixed,
			default: {},
		},
	},
	{timestamps: true}
);

TenantSchema.index({name: 1},{unique:true});
TenantSchema.index({status: 1, plan: 1});

const Tenant = mongoose.model('Tenant', TenantSchema);
export default Tenant;
