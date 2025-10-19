import UserSession from "../models/UserSession.js";
import userServices from "../services/userServices.js";
import authServices from "../services/authServices.js";

export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers['authorization']?.split(' ')[1];
		
        if (!token) {
            return res.status(401).json({ success: false, message: "Access token missing" });
        }
	    
	    const session = await UserSession.findOne({ token, revoked: false });
		
        if (!session) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        if (session.expiresAt < new Date()) {
            return res.status(401).json({ success: false, message: "Token expired" });
        }

        req.userId = session.userId;
	    next();
    } catch (err) {
        console.error("Authentication error:", err);
        res.status(500).json({ success: false, message: "Authentication failed" });
    }
};
