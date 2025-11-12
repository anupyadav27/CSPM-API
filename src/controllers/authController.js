import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import { models } from "../config/db.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    verifyAccessToken,
} from "../utils/tokenUtils.js";
import cookieServices from "../services/cookieServices.js";
import cacheServices from "../services/cacheServices.js";
import { saml } from "../utils/saml.js";

export const loginController = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await models.users.findOne({
            where: { email },
            attributes: { include: ["password_hash"] },
        });

        if (!user) {
            return res.status(404).json({ message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        await models.user_sessions.destroy({
            where: { user_id: user.id },
        });

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

        await models.users.update({ last_login: new Date() }, { where: { id: user.id } });

        await models.user_sessions.create({
            id: uuidv4(),
            user_id: user.id,
            tenant_id: user.tenant_id || null,
            token: accessToken,
            refresh_token: refreshToken,
            login_method: "local",
            expires_at: expiresAt,
            ip_address: req.ip,
            user_agent: req.headers["user-agent"],
        });

        res.setHeader("Cache-Control", "no-store");

        return res.status(200).json({
            message: "Login successful",
            expiresIn: "1h",
            user: {
                id: user.id,
                email: user.email,
                name: user.name_first + " " + user.name_last,
                preferences: {
                    theme: user.preference_theme,
                    notifications: user.preference_notifications,
                    language: user.preference_language,
                },
            },
        });
    } catch (error) {
        console.info("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const refreshAccessTokenController = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            cookieServices.clearAuthCookies(res);
            return res.status(401).json({ message: "No refresh token found" });
        }

        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch (err) {
            console.info("Invalid or expired refresh token:", err);
            cookieServices.clearAuthCookies(res);
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }

        const user = await models.users.findOne({
            where: { id: decoded.id },
        });

        if (!user) {
            cookieServices.clearAuthCookies(res);
            return res.status(404).json({ message: "User not found" });
        }

        const accessToken = generateAccessToken(user);

        await models.user_sessions.update(
            { token: accessToken },
            {
                where: {
                    user_id: user.id,
                    refresh_token: refreshToken,
                },
            }
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
                id: user.id,
                email: user.email,
                name: user.name_first + " " + user.name_last,
                preferences: {
                    theme: user.preference_theme,
                    notifications: user.preference_notifications,
                    language: user.preference_language,
                },
            },
        });
    } catch (error) {
        console.info("Refresh token error:", error);
        cookieServices.clearAuthCookies(res);
        return res.status(500).json({ message: "Internal server error during refresh" });
    }
};

export const logoutController = async (req, res) => {
    try {
        const accessToken = req.cookies?.accessToken;
        const refreshToken = req.cookies?.refreshToken;

        const tokenToUse = accessToken || refreshToken;
        const tokenType = accessToken ? "access" : "refresh";
        const verifyToken = tokenType === "access" ? verifyAccessToken : verifyRefreshToken;

        let userId = null;
        let loginMethod = "local";
        let userSession = null;

        if (tokenToUse) {
            try {
                const decoded = verifyToken(tokenToUse);
                if (!decoded?.id) throw new Error("Invalid token payload");

                userId = decoded.id;

                userSession = await models.user_sessions.findOne({
                    where: {
                        user_id: userId,
                        [tokenType === "access" ? "token" : "refresh_token"]: tokenToUse,
                    },
                });

                loginMethod = userSession?.login_method || "local";

                await models.user_sessions.destroy({
                    where: {
                        user_id: userId,
                        [tokenType === "access" ? "token" : "refresh_token"]: tokenToUse,
                    },
                });
            } catch (err) {
                console.info("Token verification or session cleanup failed:", err);
            }
        } else {
            console.log("No valid tokens found in cookies.");
        }

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

        if (loginMethod === "saml" && userSession) {
            console.log(
                `Initiating SAML SLO for user session ID ${userSession.id} (user ID: ${userId})`
            );

            try {
                const user = await models.users.findByPk(userId, { attributes: ["email"] });
                if (!user) {
                    console.info(`User not found for ID ${userId} during SAML logout.`);
                    return res.status(200).json({
                        message: "Local logout successful, but user not found for SAML SSO logout.",
                        sso: true,
                        sso_error: "User not found.",
                    });
                }

                const samlUser = {
                    nameID: user.email,
                    nameIDFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
                    sessionIndex: userSession.session_index,
                };

                const logoutUrl = await saml.getLogoutUrlAsync(
                    samlUser,
                    process.env.SAML_LOGOUT_REDIRECT_URL || process.env.FRONTEND_URL,
                    {}
                );

                if (!logoutUrl.startsWith("http")) {
                    throw new Error("Invalid SAML logout URL generated.");
                }

                console.log(`Redirecting ${user.email} to IdP logout URL: ${logoutUrl}`);
                return res.status(200).json({
                    message: "SSO logout required",
                    redirectUrl: logoutUrl,
                    sso: true,
                });
            } catch (samlError) {
                console.info("SAML SLO initiation failed:", samlError);
                return res.status(200).json({
                    message: "Local logout successful, but SAML SSO logout initiation failed.",
                    sso: true,
                    sso_error: samlError.message,
                });
            }
        }

        if (loginMethod === "saml" && !userSession) {
            console.info("SAML logout requested but session details unavailable.");
            return res.status(200).json({
                message:
                    "Cookies cleared, but SAML SSO logout could not be initiated due to missing session details.",
                sso: true,
                sso_error: "Missing session identification for SAML SLO.",
            });
        }

        return res.status(200).json({
            message: "Logout successful",
            sso: false,
        });
    } catch (error) {
        console.info("General logout error:", error);

        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        cacheServices.clearAll(res);
        cookieServices.clearAuthCookies(res);

        return res.status(500).json({
            message: "An error occurred during logout.",
            sso: false,
            error: process.env.NODE_ENV === "production" ? undefined : error.message,
        });
    }
};
