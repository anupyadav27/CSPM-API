import dotenv from "dotenv";
import fs from "fs";
import { SAML } from "passport-saml";

dotenv.config();

console.log("🟢 Initializing manual SAML request test...");

// --- STEP 1: Load Okta certificate ---
const certPath = process.env.OKTA_CERT || "./okta.cert";
const cert = fs.readFileSync(certPath, "utf-8");

// --- STEP 2: Initialize the SAML client ---
const saml = new SAML({
  entryPoint:
    process.env.OKTA_ENTRYPOINT,
  issuer:
    process.env.SAML_ISSUER,
  callbackUrl:
    process.env.OKTA_CALLBACK_URL,
  cert,
  identifierFormat:
    "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
  disableRequestedAuthnContext: true,
});

try {
  // --- STEP 3: Generate the SAML authorization URL manually ---
  const loginUrl = await saml.getAuthorizeUrlAsync({
    forceAuthn: true,
    RelayState: "manual-test",
  });

  console.log("✅ Generated Okta login URL successfully:");
  console.log(loginUrl);
  console.log("\n👉 Open this URL in your browser to trigger SSO login.");
} catch (err) {
  console.error("❌ Error generating SAML request:", err);
}
