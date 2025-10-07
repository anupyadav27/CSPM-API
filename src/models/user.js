import mongoose from "mongoose";
const {Schema} = mongoose;

const RoleEnum = ['super_admin', 'admin', 'tenant_admin', 'user', 'read_only'];

const UserSchema = new Schema(
	{
		tenantId: {type: Schema.Types.ObjectId, ref: 'Tenant', index: true},
		email: {type: String, required: true, unique: true, lowercase: true, trim: true},
		passwordHash: {type: String, select: false},
		ssoProvider: {type: String, default: null},
		ssoId: {type: String, default: null},
		
		name: {
			first: {type: String, trim: true},
			last: {type: String, trim: true},
		},
		
		roles: {
			type: [{type: String, enum: RoleEnum}],
			default: ['user'],
		},
		
		status: {
			type: String,
			enum: ['active', 'inactive', 'pending', 'suspended'],
			default: 'active',
			index: true,
		},
		
		lastLogin: {type: Date},
		loginHistory: [
			{
				timestamp: {type: Date, default: Date.now},
				ip: String,
				userAgent: String,
			},
		],
		
		preferences: {
			theme: {type: String, enum: ['light', 'dark'], default: 'light'},
			notifications: {type: Boolean, default: true},
			language: {type: String, default: 'en'},
		},
		
		metadata: {
			type: Schema.Types.Mixed,
			default: {},
		},
	},
	{timestamps: true}
);

UserSchema.index({email: 1, tenantId: 1});

const User = mongoose.model('User', UserSchema);
export default User;
