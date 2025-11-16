import { models } from "../config/db.js";

export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Access token missing" });
        }

        const session = await models.user_sessions.findOne({
            where: {
                token: token,
                revoked: false,
            },
            include: [
                {
                    model: models.users,
                    as: "user",
                    attributes: ["id", "email", "name_first", "name_last"],
                    include: [
                        {
                            model: models.user_roles,
                            as: "user_roles",
                            attributes: [],
                            required: false,
                            include: [
                                {
                                    model: models.roles,
                                    as: "role",
                                    attributes: ["id", "name"],
                                    required: false,
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!session) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }

        if (session.expires_at < new Date()) {
            return res.status(401).json({ success: false, message: "Token expired" });
        }

        req.userId = session.user_id;
        req.user = session.user ? session.user.toJSON() : null;

        if (session.user && session.user.user_roles) {
            req.user.roles = session.user.user_roles.map((ur) => ({
                id: ur.role.id,
                name: ur.role.name,
            }));
        } else {
            req.user.roles = [];
        }

        if (req.user) {
            delete req.user.user_roles;
        }

        next();
    } catch (err) {
        console.error("Authentication error:", err);
        res.status(500).json({ success: false, message: "Authentication failed" });
    }
};
