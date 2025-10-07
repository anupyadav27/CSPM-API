import mongoose from "mongoose";

const {Schema} = mongoose;

const CloudConnectorSchema = new Schema(
	{
		tenantId: {
			type: Schema.Types.ObjectId,
			ref: 'Tenant',
			required: true,
			index: true,
		},
		
		name: {
			type: String,
			required: true,
			trim: true,
		},
		
		provider: {
			type: String,
			required: true,
			enum: ['aws', 'azure', 'gcp', 'custom'],
			index: true,
		},
		
		config: {
			type: Schema.Types.Mixed,
			required: true,
		},
		
		credentials: {
			type: {
				type: String,
				enum: ['access_key', 'service_principal', 'iam_role', 'oauth', 'custom'],
				required: true,
			},
			details: {
				type: Schema.Types.Mixed,
				required: true,
			},
			storedInSecretsManager: {
				type: Boolean,
				default: true,
			},
		},
		
		status: {
			type: String,
			enum: ['connected', 'disconnected', 'error', 'pending'],
			default: 'pending',
		},
		
		lastSync: {
			startedAt: {type: Date},
			completedAt: {type: Date},
			status: {
				type: String,
				enum: ['success', 'failed', 'partial', 'in_progress'],
			},
			message: {type: String},
		},
		
		health: {
			lastChecked: {type: Date},
			status: {
				type: String,
				enum: ['healthy', 'degraded', 'unhealthy', 'unknown'],
				default: 'unknown',
			},
			issues: [{type: String}],
		},
		
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		updatedBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{timestamps: true}
);

CloudConnectorSchema.index({tenantId: 1, provider: 1});
CloudConnectorSchema.index({status: 1});
CloudConnectorSchema.index({'health.status': 1});
CloudConnectorSchema.index({updatedAt: -1});
CloudConnectorSchema.index({'lastSync.status': 1});

CloudConnectorSchema.index({name: 'text', 'lastSync.message': 'text'});

module.exports = mongoose.model('CloudConnector', CloudConnectorSchema);
