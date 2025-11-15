import fs from "fs";
import path from "path";
import { SAML } from "@node-saml/node-saml";

const certPath = process.env.OKTA_CERT || path.resolve("okta_cert.pem");
let cert = "";

try {
    if (!fs.existsSync(certPath)) {
        console.info(`[SAML] Certificate file not found at: ${certPath}`);
    } else {
        cert = fs.readFileSync(certPath, "utf-8");
        console.log(`[SAML] Certificate loaded from: ${certPath}`);
    }
} catch (err) {
    console.info("[SAML] Failed to load Okta certificate:", err);
}

export const saml = new SAML({
    entryPoint: process.env.OKTA_ENTRYPOINT,
    issuer: process.env.SAML_AUDIENCE,
    idpIssuer: process.env.OKTA_ISSUER,
    idpCert: cert,
    callbackUrl: process.env.SAML_CALLBACK_URL,

    identifierFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
    disableRequestedAuthnContext: true,
    acceptedClockSkewMs: 2000,
    forceAuthn: true,

    logoutUrl: process.env.OKTA_LOGOUT,
    logoutCallbackUrl: process.env.SAML_LOGOUT_CALLBACK_URL,
    additionalParams: {
        RelayState: process.env.SAML_LOGOUT_REDIRECT_URL || process.env.FRONTEND_URL || "http://localhost:3000/login",
    },

    audience: process.env.SAML_AUDIENCE,
    validateInResponseTo: "ifPresent",
});
