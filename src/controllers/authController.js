import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateAccessToken = (user) => {
	return jwt.sign(
		{id: user._id, email: user.email, roles: user.roles},
		process.env.JWT_SECRET,
		{expiresIn: "1h"}
	);
};

const generateRefreshToken = (user) => {
	return jwt.sign({id: user._id}, process.env.JWT_REFRESH_SECRET, {expiresIn: "7d"});
};

export const login = async (req, res) => {
	try {
		const {email, password, rememberMe} = req.body;
		
		if (!email || !password)
			return res.status(400).json({message: "Email and password are required."});
		
		const user = await User.findOne({email}).select("+passwordHash");
		if (!user)
			return res.status(404).json({message: "Invalid email or password."});
		
		const isMatch = await bcrypt.compare(password, user.passwordHash);
		if (!isMatch)
			return res.status(401).json({message: "Invalid email or password."});
		
		const accessToken = generateAccessToken(user);
		
		if (rememberMe) {
			const refreshToken = generateRefreshToken(user);
			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "Strict",
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});
		}
		
		user.lastLogin = new Date();
		await user.save();
		
		return res.status(200).json({
			message: "Login successful",
			token: accessToken,
			expiresIn: "1h",
			rememberMe,
			user: {
				id: user._id,
				email: user.email,
				roles: user.roles,
				name: user.name,
				preferences: user.preferences,
			},
		});
	} catch (error) {
		console.error("Login Error:", error);
		res.status(500).json({message: "Internal Server Error"});
	}
};

export const refreshAccessToken = async (req, res) => {
	const {refreshToken} = req.cookies;
	if (!refreshToken)
		return res.status(401).json({message: "No refresh token provided."});
	
	try {
		const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
		const user = await User.findById(decoded.id);
		if (!user) return res.status(404).json({message: "User not found."});
		
		const accessToken = generateAccessToken(user);
		
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});
		
		return res.status(200).json({
			message: "Token refreshed successfully",
			token: accessToken,
			expiresIn: "1h",
			user: {
				id: user._id,
				email: user.email,
				roles: user.roles,
				name: user.name,
				preferences: user.preferences,
			},
		});
	} catch (error) {
		console.error("Refresh token error:", error);
		res.status(401).json({message: "Invalid or expired refresh token."});
	}
};

export const logout = async (req, res) => {
	res.clearCookie("refreshToken");
	res.json({message: "Logged out successfully"});
};
