import {SAML} from "passport-saml";
import fs from "fs";
import User from "../models/user.js";
import UserSession from "../models/userSession.js";
import {generateAccessToken, generateRefreshToken} from "../utils/jwt.js";


const certPath = process.env.OKTA_CERT;
const cert = fs.readFileSync(certPath, "utf-8");

const saml = new SAML({
	entryPoint: process.env.OKTA_ENTRYPOINT,
	issuer: process.env.OKTA_ISSUER,
	callbackUrl: process.env.OKTA_CALLBACK_URL,
	cert,
	identifierFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
	disableRequestedAuthnContext: true,
});

export const samlLogin = async (req, res) => {
	try {
		const loginUrl = await saml.getAuthorizeUrlAsync({
			forceAuthn: true,
			RelayState: "next-js",
		});
		
		res.redirect(loginUrl)
	} catch (err) {
		console.error("Error generating SAML request:", err);
	}
}
export const samlAcs = async (req, res) => {
	try {
		const samlResponse = req.body?.SAMLResponse;
		if (!samlResponse) {
			return res.status(400).json({error: "Missing SAMLResponse"});
		}
		
		
		const profile = (await saml.validatePostResponseAsync({SAMLResponse: samlResponse})).profile;
		
		
		if (!profile.nameID) {
			return res.status(401).json({error: "Invalid SAML response: missing nameID"});
		}
		
		const email = profile.nameID.toLowerCase();
		
		let user = await User.findOne({email});
		if (!user) {
			user = await User.create({
				email,
				ssoProvider: "okta",
				ssoId: profile.sessionIndex,
				status: "active",
				roles: ["user"],
				name: {first: email.split("@")[0]},
			});
		}
		
		if (user) {
			await UserSession.deleteMany({userId: user._id});
		}
		
		const accessToken = generateAccessToken(user);
		
		
		const refreshToken = generateRefreshToken(user);
		
		
		const session = await UserSession.create({
			userId: user._id,
			tenantId: user.tenantId || null,
			token: accessToken,
			refreshToken: refreshToken,
			loginMethod: "saml",
			expiresAt: new Date(Date.now() + 24 * 3600 * 1000),
			ipAddress: req.ip,
			userAgent: req.headers["user-agent"],
		});
		
		
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
			maxAge: 24 * 60 * 60 * 1000,
			path:"/api/auth/refresh"
		});
		
		
		const redirectUrl = `${process.env.FRONTEND_URL}/dashboard`;
		res.redirect(302, redirectUrl);
		
	} catch (err) {
		res.status(500).json({error: "SAML login failed", details: err.message});
	}
};
