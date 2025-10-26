import crypto from "crypto";

import UserSession from "../models/userSession.js";
import User from "../models/User.js";

export const testController = async (req, res) => {
    try {
        const accessToken = req.cookies?.accessToken;
        if (!accessToken) {
            return res.status(401).json({ success: false, message: "Access token missing" });
        }

        const session = await UserSession.findOne({ token: accessToken });
        if (!session) {
            return res.status(401).json({ success: false, message: "Invalid session" });
        }

        const user = await User.findById(session.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const jsonResponse = {
            success: true,
            message: "Current session user",
            data: {
                id: user._id,
                email: user.email,
                roles: user.roles,
                name: user.name,
                preferences: user.preferences,
            },
        };

        const etag = crypto
            .createHash("md5")
            .update(JSON.stringify(jsonResponse.data))
            .digest("hex");

        const clientETag = req.headers["if-none-match"];
        if (clientETag && clientETag === etag) {
            return res.status(304).end();
        }

        res.setHeader("Cache-Control", "private, max-age=300, stale-while-revalidate=120");
        res.setHeader("Vary", "Authorization");
        res.setHeader("ETag", etag);
        res.setHeader("Content-Type", "application/json");

        return res.status(200).json(jsonResponse);
    } catch (error) {
        console.error("Test Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch session user",
            error: error.message,
        });
    }
};
