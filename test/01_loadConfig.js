import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const certPath = process.env.OKTA_CERT || "./okta.cert";
const cert = fs.readFileSync(certPath, "utf-8");

console.log("✅ Env variables loaded:");
console.log({
  OKTA_ENTRYPOINT: process.env.OKTA_ENTRYPOINT,
  OKTA_ISSUER: process.env.OKTA_ISSUER,
  SAML_CALLBACK_URL: process.env.SAML_CALLBACK_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
});
console.log("✅ OKTA Cert loaded:");
console.log(cert.slice(0, 100) + "...");
