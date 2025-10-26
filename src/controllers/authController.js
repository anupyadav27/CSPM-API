import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import UserSession from "../models/userSession.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import cacheServices from "../services/cacheServices.js";
import cookieServices from "../services/cookieServices.js";

export const login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Email and password are required." });

        const user = await User.findOne({ email }).select("+passwordHash");
        if (!user) return res.status(404).json({ message: "Invalid email or password." });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password." });

        if (user && isMatch) {
            await UserSession.deleteMany({ userId: user._id });
        }
        const expiryDelta = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 3600 * 1000;
        const expiresAt = new Date(Date.now() + expiryDelta);

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        if (rememberMe) {
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: "/api/auth/refresh",
            });
        }

        res.cookie("accessToken", accessToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 3600 * 1000,
            path: "/",
        });

        user.lastLogin = new Date();
        await user.save();

        await UserSession.create({
            userId: user._id,
            tenantId: user.tenantId || null,
            token: accessToken,
            refreshToken,
            loginMethod: "local",
            expiresAt,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });

        res.setHeader("Cache-Control", "no-store");

        return res.status(200).json({
            message: "Login successful",
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
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            cookieServices.clearAuthCookies(res);
            return res.status(401).json({ message: "No refresh token found" });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            console.error("Invalid or expired refresh token:", err);
            cookieServices.clearAuthCookies(res);
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            cookieServices.clearAuthCookies(res);
            return res.status(404).json({ message: "User not found" });
        }

        const accessToken = generateAccessToken(user);

        await UserSession.updateOne(
            { userId: user._id, refreshToken },
            { $set: { token: accessToken } }
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 3600 * 1000,
            path: "/",
        });

        return res.status(200).json({
            message: "Access token refreshed successfully",
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
        cookieServices.clearAuthCookies(res);
        return res.status(500).json({ message: "Internal server error during refresh" });
    }
};

export const logout = async (req, res) => {
    try {
        const accessToken = req.cookies?.accessToken;
        const refreshToken = req.cookies?.refreshToken;

        const tokenToUse = accessToken || refreshToken;
        const tokenType = accessToken ? "accessToken" : "refreshToken";
        const tokenLabel = accessToken ? "token" : "refreshToken";

        if (tokenToUse) {
            try {
                const decodedToken = jwt.verify(
                    tokenToUse,
                    tokenType === "accessToken"
                        ? process.env.JWT_SECRET
                        : process.env.JWT_REFRESH_SECRET
                );

                const userId = decodedToken.id;

                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "Strict",
                    path: "/api/auth/refresh",
                });

                res.clearCookie("accessToken", {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "Strict",
                    path: "/",
                });

                cacheServices.clearAll(res);
                cookieServices.clearAuthCookies(res);

                const lastSession = await UserSession.findOne({ userId }).sort({ createdAt: -1 });
                const loginMethod = lastSession?.loginMethod || "local";

                await UserSession.deleteMany({ userId, [tokenLabel]: tokenToUse });

                if (loginMethod === "saml") {
                    const logoutUrl = `${process.env.OKTA_LOGOUT}?&post_logout_redirect_uri=${process.env.FRONTEND_URL}/auth/login`;
                    return res.status(200).json({
                        message: "SSO logout required",
                        redirectUrl: logoutUrl,
                        sso: true,
                    });
                }
            } catch (err) {
                console.error("Token verification or logout failed:", err);
                cacheServices.clearAll(res);
                cookieServices.clearAuthCookies(res);
            }
        } else {
            cacheServices.clearAll(res);
            cookieServices.clearAuthCookies(res);
        }

        return res.status(200).json({ message: "Logout successful", sso: false });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(200).json({ message: "Logout successful (fallback)", sso: false });
    }
};
