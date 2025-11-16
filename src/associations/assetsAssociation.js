import { models } from "../config/db.js";

export const ASSOCIATION_MAP = {
    tenants: {
        model: models.tenants,
        as: "tenants",
        attributes: ["id", "name"],
        required: false,
    },
    asset_tags: {
        model: models.asset_tags,
        as: "asset_tags",
        attributes: ["tag_key", "tag_value"],
        required: false,
    },
    asset_compliance: {
        model: models.asset_compliance,
        as: "asset_compliance",
        attributes: ["compliance_id"],
        required: false,
        include: [
            {
                model: models.compliance,
                as: "compliance",
                attributes: ["id", "name", "standard"],
                required: false,
            },
        ],
    },
    asset_threats: {
        model: models.asset_threats,
        as: "asset_threats",
        attributes: ["threat_id"],
        required: false,
        include: [
            {
                model: models.threats,
                as: "threat",
                attributes: ["id", "name", "severity", "description"],
                required: false,
            },
        ],
    },
    policy_assets: {
        model: models.policy_assets,
        as: "policy_assets",
        attributes: ["policy_id"],
        required: false,
        include: [
            {
                model: models.policies,
                as: "policy",
                attributes: ["id", "name", "category", "severity_threshold"],
                required: false,
            },
        ],
    },
    report_assets: {
        model: models.report_assets,
        as: "report_assets",
        attributes: ["report_id"],
        required: false,
        include: [
            {
                model: models.reports,
                as: "report",
                attributes: ["id", "name", "type", "status", "generated_at"],
                required: false,
            },
        ],
    },
    scan_vulnerabilities: {
        model: models.scan_vulnerabilities,
        as: "scan_vulnerabilities",
        attributes: ["cve_id", "severity", "status"],
        required: false,
        include: [
            {
                model: models.cves,
                as: "cve",
                attributes: ["id", "cve_id", "title", "cvss_score", "published_date"],
                required: false,
            },
        ],
    },
    scans: {
        model: models.scans,
        as: "scans",
        attributes: ["id", "scan_type", "status", "started_at", "completed_at"],
        required: false,
    },
    audit_logs: {
        model: models.audit_logs,
        as: "audit_logs",
        attributes: ["id", "action", "timestamp", "details"],
        required: false,
        include: [
            {
                model: models.users,
                as: "user",
                attributes: ["id", "username", "email"],
                required: false,
            },
        ],
    },
};
