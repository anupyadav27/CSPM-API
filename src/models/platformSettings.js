import mongoose from "mongoose";

const {Schema} = mongoose;

const PlatformSettingsSchema = new Schema(
	{
		key: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			index: true,
		},
		value: {
			type: Schema.Types.Mixed,
			required: true,
		},
		description: {
			type: String,
			trim: true,
		},
		updatedBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{timestamps: true}
);

PlatformSettingsSchema.index({key: 1}, {unique: true});
PlatformSettingsSchema.index({updatedAt: -1});
PlatformSettingsSchema.index({updatedBy: 1});

PlatformSettingsSchema.index({description: 'text'});

const PlatformSettings = mongoose.model('PlatformSettings', PlatformSettingsSchema);
export default PlatformSettings;
