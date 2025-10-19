import UserSession from "../models/UserSession.js";

const authServices = {
    async getUserIdByToken(token) {
        const session = await UserSession.findOne({ token, revoked: false });
        if (!session || session.expiresAt < new Date()) return null;
        return session.userId;
    },
};

export default authServices;
