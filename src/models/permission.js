import mongoose from "mongoose";

const {Schema} = mongoose;

const PermissionSchema = new Schema(
	{
		key: {type: String, required: true, unique: true},
		feature: {type: String, required: true},
		action: {
			type: String,
			enum: ["create", "read", "update", "delete", "manage"],
			required: true
		},
		description: {type: String},
		tenantScoped: {type: Boolean, default: true},
		createdBy: {type: Schema.Types.ObjectId, ref: "User"},
		updatedBy: {type: Schema.Types.ObjectId, ref: "User"},
	},
	{timestamps: true}
);

PermissionSchema.index({feature: 1, action: 1}, {unique: true});

const Permission = mongoose.model("Permission", PermissionSchema);
export default Permission;
