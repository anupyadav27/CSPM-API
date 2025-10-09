import mongoose from "mongoose";

const {Schema, model, models} = mongoose;

const UserSessionSchema = new Schema(
	{
		userId: {type: Schema.Types.ObjectId, ref: 'User', required: true, index: true},
		tenantId: {type: Schema.Types.ObjectId, ref: 'Tenant', index: true},
		
		token: {type: String, required: true},
		refreshToken: {type: String, select: false},
		ipAddress: {type: String},
		userAgent: {type: String},
		
		loginMethod: {
			type: String,
			enum: ['local', 'saml', 'oidc', 'api_key'],
			default: 'local',
		},
		
		expiresAt: {type: Date, required: true},
		revoked: {type: Boolean, default: false},
		
		location: {
			country: {type: String},
			city: {type: String},
			region: {type: String},
		},
		
		metadata: {
			type: Schema.Types.Mixed,
			default: {},
		},
	},
	{timestamps: true}
);

UserSessionSchema.index({userId: 1, expiresAt: 1});
UserSessionSchema.index({revoked: 1});

const UserSession = models.UserSession || model("UserSession", UserSessionSchema);
export default UserSession;
