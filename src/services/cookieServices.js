const cookieServices = {
    clearAuthCookies: (res) => {
        if (!res || typeof res.clearCookie !== "function") {
            console.warn("res.clearCookie is not available");
            return;
        }

        const secure = process.env.NODE_ENV === "production";
        const sameSite = "Strict";

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure,
            sameSite,
            path: "/api/auth/refresh",
        });

        res.clearCookie("accessToken", {
            httpOnly: false,
            secure,
            sameSite,
            path: "/",
        });
    },
};

export default cookieServices;
