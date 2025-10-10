import fs from "fs";
import dotenv from "dotenv";
import { SAML } from "passport-saml";

dotenv.config();

// --- STEP 1: Read Okta cert ---
const certPath = process.env.OKTA_CERT || "./okta.cert";
const cert = fs.readFileSync(certPath, "utf8");

// --- STEP 2: Create SAML client (same config as before) ---
const saml = new SAML({
  entryPoint:
    process.env.OKTA_ENTRY_POINT ||
    "https://integrator-2500890.okta.com/app/integrator-2500890_cspm_1/exkw7wtp1m754Nxpm697/sso/saml",
  issuer:
    process.env.SAML_ISSUER ||
    "http://www.okta.com/exkw7wtp1m754Nxpm697",
  callbackUrl:
    process.env.OKTA_CALLBACK_URL ||
    "http://localhost:5000/api/auth/saml/acs",
  cert,
  audience:
    process.env.SAML_AUDIENCE ||
    "http://localhost:5000/api/auth/saml/metadata",
  identifierFormat:
    "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
  disableRequestedAuthnContext: true,
});

// --- STEP 3: Paste your SAMLResponse here ---
const samlResponse =
  `PASTE_YOUR_SAML_RESPONSE_HERE`;

// --- STEP 4: Decode and validate ---
(async () => {
  try {
    console.log("📦 Decoding SAML Response...");
    const profile = await saml.validatePostResponseAsync({
      SAMLResponse: samlResponse,
    });

    console.log("✅ SAML Response validated successfully!");
    console.log("👤 User profile extracted:");
    console.log(profile);
  } catch (err) {
    console.error("❌ Error validating SAML response:", err);
  }
})();
