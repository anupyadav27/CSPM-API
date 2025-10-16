import mongoose from "mongoose";

const {Schema, model, models} = mongoose;

const RoleEnum = ['tenant_admin', 'user', 'read_only', 'auditor', 'custom','admin','super_admin'];

const UserSchema = new Schema(
	{
		email: {type: String, required: true, lowercase: true, trim: true},
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

UserSchema.index({ email: 1 }, { unique: true });

const User = models.User || model("User", UserSchema);
export default User;
