import {getAllUsers} from "../services/userServices.js";

export const getAllUsersController = async (req, res) => {
	try {
		const filters = req.query || {};
		const users = await getAllUsers(filters);
		
		return res.status(200).json({
			success: true,
			message: "Users fetched successfully",
			data: users,
		});
	} catch (error) {
		console.error("Error in getAllUsersController:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch users",
			error: error.message,
		});
	}
};
