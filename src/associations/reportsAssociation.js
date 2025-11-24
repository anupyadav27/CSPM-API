import { models } from "../config/db.js";

export const ASSOCIATION_MAP = {
    tenants: {
        model: models.tenants,
        as: "tenants",
        attributes: ["id", "name"],
        required: false,
    },
    users: {
        model: models.users,
        as: "generated_by_user",
        attributes: ["id", "name", "email"],
        required: false,
    },
    reports: {
        model: models.reports,
        as: "reports",
        attributes: ["id", "title", "description", "type", "status", "generated_at"],
        required: false,
    },
    report_assets: {
        model: models.report_assets,
        as: "report_assets",
        attributes: ["asset_id"],
        required: false,
        include: [
            {
                model: models.assets,
                as: "assets",
                attributes: ["id", "name", "resource_id", "resource_type", "provider", "environment"],
                required: false,
            },
        ],
    },
    report_compliance: {
        model: models.report_compliance,
        as: "report_compliances",
        attributes: ["compliance_id"],
        required: false,
        include: [
            {
                model: models.compliance,
                as: "compliance",
                attributes: ["id", "framework", "control_id", "control_title", "status", "severity"],
                required: false,
            },
        ],
    },
    report_policies: {
        model: models.report_policies,
        as: "report_policies",
        attributes: ["policy_id"],
        required: false,
        include: [
            {
                model: models.policies,
                as: "policy",
                attributes: ["id", "name", "description", "category"],
                required: false,
            },
        ],
    },
};
