import { v4 as uuidv4 } from "uuid";
import { Buffer } from "buffer";

import { models } from "../config/db.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token-utils.js";
import { saml } from "../utils/saml.js";

export const samlLoginController = async (req, res) => {
    try {
        const loginUrl = await saml.getAuthorizeUrlAsync({
            forceAuthn: true,
            RelayState: process.env.FRONTEND_URL,
        });

        return res.redirect(loginUrl);
    } catch (err) {
        console.info("Error generating SAML request:", err);
        return res.status(500).json({ error: "Could not initiate SAML login" });
    }
};

export const samlAcsController = async (req, res) => {
    try {
        const samlResponse = req.body?.SAMLResponse;
        if (!samlResponse) {
            return res.status(400).json({ error: "Missing SAMLResponse" });
        }

        const { profile } = await saml.validatePostResponseAsync({
            SAMLResponse: samlResponse,
        });

        if (!profile?.nameID) {
            return res.status(401).json({ error: "Invalid SAML response: missing nameID" });
        }

        const email = profile.nameID.toLowerCase();

        let user = await models.users.findOne({ where: { email } });

        if (!user) {
            user = await models.users.create({
                id: uuidv4(),
                email,
                sso_provider: "okta",
                sso_id: profile.sessionIndex,
                status: "active",
                name: email.split("@")[0],
                created_at: new Date(),
            });
        }

        await models.user_sessions.destroy({
            where: { user_id: user.id },
        });

        console.log(`Creating new SAML session for ${email}`);

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const expiresAt = new Date(Date.now() + 3600 * 1000);

        await models.user_sessions.create({
            id: uuidv4(),
            user_id: user.id,
            session_index: user.sessionIndex,
            token: accessToken,
            refresh_token: refreshToken,
            login_method: "saml",
            expires_at: expiresAt,
            ip_address: req.ip,
            user_agent: req.headers["user-agent"],
        });

        await models.users.update({ last_login: new Date() }, { where: { id: user.id } });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000,
            path: "/api/auth/refresh",
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 3600 * 1000,
            path: "/",
        });

        const redirectUrl = `${process.env.FRONTEND_URL}/dashboard`;
        return res.redirect(302, redirectUrl);
    } catch (err) {
        console.info("SAML login failed:", err);
        return res.status(500).json({
            error: "SAML login failed",
            details: err.message,
        });
    }
};

export const samlLogoutCallbackController = async (req, res) => {
    try {
        console.log("🔹 SLO Callback:", req.method, req.body, req.query);

        const { SAMLRequest, SAMLResponse, RelayState } = req.body || {};

        if (SAMLRequest) {
            console.log("➡️  IdP-Initiated SLO request received");

            const { profile: sloProfile } = await saml.validatePostRequestAsync({ SAMLRequest });
            if (!sloProfile) throw new Error("SLO profile missing from IdP logout request");

            const nameID = sloProfile.nameID;
            const sessionIndex = sloProfile.sessionIndex || "N/A";

            console.log(`✅ Logout requested for NameID: ${nameID}, SessionIndex: ${sessionIndex}`);

            const user = await models.users.findOne({ where: { email: nameID.toLowerCase() } });
            if (user) {
                await models.user_sessions.destroy({ where: { user_id: user.id } });
                console.log(`🗑️ Deleted local session(s) for user ${nameID}`);
            } else {
                console.info(`User ${nameID} not found in local DB during IdP-initiated logout`);
            }

            const logoutResponse = saml._generateLogoutResponse(sloProfile, true);
            const redirectAfterSlo = RelayState || process.env.SAML_LOGOUT_REDIRECT_URL || process.env.FRONTEND_URL || "http://localhost:3000/login";

            const sloEndpoint = process.env.OKTA_ENTRYPOINT?.replace("/sso/saml", "/slo/saml");

            res.setHeader("Content-Type", "text/html");
            res.send(`
                <!DOCTYPE html>
                <html>
                <head><title>Logging out...</title></head>
                <body>
                    <form method="post" action="${sloEndpoint}">
                        <input type="hidden" name="SAMLResponse" value="${Buffer.from(logoutResponse).toString("base64")}" />
                        <input type="hidden" name="RelayState" value="${redirectAfterSlo}" />
                        <noscript>
                            <p>Click below to complete logout.</p>
                            <input type="submit" value="Continue" />
                        </noscript>
                    </form>
                    <script>document.forms[0].submit();</script>
                </body>
                </html>
            `);

            console.log(`Sent LogoutResponse back to IdP, will redirect to ${redirectAfterSlo}`);
            return;
        }

        if (SAMLResponse) {
            console.log("SP-Initiated SLO response received from IdP");

            await saml.validatePostResponseAsync({ SAMLResponse });
            console.log("SP-Initiated SLO confirmed by Okta");

            res.clearCookie("accessToken", {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                path: "/",
            });
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                path: "/api/auth/refresh",
            });

            const redirectUrl = RelayState || process.env.SAML_LOGOUT_REDIRECT_URL || process.env.FRONTEND_URL || "http://localhost:3000";

            console.log(`Redirecting user to: ${redirectUrl}`);
            return res.redirect(redirectUrl);
        }

        console.info("SLO callback missing SAMLRequest and SAMLResponse");
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login`);
    } catch (err) {
        console.info("SAML SLO callback error:", err);
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login`);
    }
};
