import jwt from "jsonwebtoken";

export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

export const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};

export const generateRefreshToken = (user, longLived = true) => {
    const expiresIn = longLived ? "1d" : "1h";

    return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn });
};
