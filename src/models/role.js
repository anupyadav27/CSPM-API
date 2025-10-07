import mongoose from "mongoose";
const {Schema} = mongoose;

const RoleSchema = new Schema(
	{
		name: {type: String, required: true},
		description: {type: String},
		tenantScoped: {type: Boolean, default: true},
		permissions: [{type: Schema.Types.ObjectId, ref: "Permission"}],
		createdBy: {type: Schema.Types.ObjectId, ref: "User"},
		updatedBy: {type: Schema.Types.ObjectId, ref: "User"},
	},
	{timestamps: true}
);

RoleSchema.index({name: 1, tenantScoped: 1}, {unique: true});

const Role = mongoose.model("Role", RoleSchema);
export default Role;
