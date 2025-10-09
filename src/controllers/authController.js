import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import UserSession from "../models/userSession.js";
import {generateAccessToken, generateRefreshToken} from "../utils/jwt.js";

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
		
		
		const expiryDelta = rememberMe ? 24 * 3600 * 1000 : 3600 * 1000;
		const expiresAt = new Date(Date.now() + expiryDelta);
		
		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
			maxAge: expiresAt,
		});
		
		user.lastLogin = new Date();
		await user.save();
		
		const session = await UserSession.create({
			userId: user._id,
			tenantId: user.tenantId || null,
			token: accessToken,
			refreshToken: refreshToken || null,
			loginMethod: "local",
			expiresAt: expiresAt,
			ipAddress: req.ip,
			userAgent: req.headers["user-agent"],
		});
		
		
		return res.status(200).json({
			message: "Login successful",
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
	try {
		const refreshToken = req.cookies?.refreshToken;
		
		if (refreshToken) {
			const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
			
			await UserSession.deleteOne({userId: decoded.id, refreshToken});
			
			const lastSession = await UserSession.findOne({userId: decoded.id}).sort({createdAt: -1});
			const loginMethod = lastSession?.loginMethod || "local";
			
			res.clearCookie("refreshToken", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "Strict",
			});
			
			if (loginMethod === "saml") {
				const logoutUrl = `${process.env.OKTA_LOGOUT_URL}?id_token_hint=${refreshToken}&post_logout_redirect_uri=${process.env.FRONTEND_URL}/auth/login`;
				return res.status(200).json({
					message: "SSO logout required",
					redirectUrl: logoutUrl,
					sso: true,
				});
			}
		}
		
		return res.status(200).json({message: "Logout successful", sso: false});
	} catch (error) {
		console.error("Logout error:", error);
		return res.status(200).json({message: "Logout successful (fallback)", sso: false});
	}
};

