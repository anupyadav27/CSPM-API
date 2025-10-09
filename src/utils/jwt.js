import jwt from "jsonwebtoken";

export const createToken = (payload, expiresIn = "1h") => {
	return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn});
};

export const verifyToken = (token) => {
	return jwt.verify(token, process.env.JWT_SECRET);
};

export const generateAccessToken = (user) => {
	return jwt.sign({id: user._id, email: user.email, roles: user.roles}, process.env.JWT_SECRET, {expiresIn: "1h"});
};

export const generateRefreshToken = (user, longLived = true) => {
	const expiresIn = longLived ? "1d" : "1h";
	
	return jwt.sign({id: user._id}, process.env.JWT_REFRESH_SECRET, {expiresIn});
};
