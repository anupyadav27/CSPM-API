const mongoose = require('mongoose');
const {Schema} = mongoose;

const AuditLogSchema = new Schema(
	{
		tenantId: {type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true},
		userId: {type: Schema.Types.ObjectId, ref: 'User'},
		action: {type: String, required: true},
		entityType: {type: String},
		entityId: {type: Schema.Types.ObjectId},
		description: {type: String},
		
		ipAddress: {type: String},
		userAgent: {type: String},
		requestId: {type: String},
		method: {type: String, enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']},
		endpoint: {type: String},
		
		before: {type: Schema.Types.Mixed},
		after: {type: Schema.Types.Mixed},
		
		severity: {type: String, enum: ['info', 'warning', 'error', 'critical'], default: 'info'},
		source: {type: String, enum: ['system', 'user', 'automation'], default: 'user'},
		
		timestamp: {type: Date, default: Date.now},
	},
	{timestamps: true}
);

AuditLogSchema.index({tenantId: 1, action: 1});
AuditLogSchema.index({timestamp: -1});
AuditLogSchema.index({entityType: 1, entityId: 1});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
