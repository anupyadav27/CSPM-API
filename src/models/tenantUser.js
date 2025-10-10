import mongoose from "mongoose";

const {Schema} = mongoose;

const TenantUserSchema = new Schema(
	{
		tenantId: {type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true},
		userId: {type: Schema.Types.ObjectId, ref: 'User', required: true, index: true},
		
		roles: {
			type: [{type: String, enum: ['tenant_admin', 'user', 'read_only', 'auditor', 'custom','admin','super_admin']}],
			default: ['user'],
		},
		
		status: {
			type: String,
			enum: ['invited', 'active', 'suspended', 'removed'],
			default: 'active',
		},
		
		permissions: [
			{
				resource: {type: String},
				actions: [{type: String}],
			},
		],
		
		lastAccessedAt: {type: Date},
		invitedAt: {type: Date},
		joinedAt: {type: Date},
		removedAt: {type: Date},
		
		metadata: {
			type: Schema.Types.Mixed,
			default: {},
		},
	},
	{timestamps: true}
);

TenantUserSchema.index({tenantId: 1, userId: 1}, {unique: true});
TenantUserSchema.index({roles: 1});
TenantUserSchema.index({status: 1});

const TenantUser = mongoose.model('TenantUser', TenantUserSchema);
export default TenantUser;
