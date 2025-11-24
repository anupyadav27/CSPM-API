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
        as: "created_by_user",
        attributes: ["id", "name", "email"],
        required: false,
    },
    updated_by_user: {
        model: models.users,
        as: "updated_by_user",
        attributes: ["id", "name", "email"],
        required: false,
    },
    policies: {
        model: models.policies,
        as: "policies",
        attributes: ["id", "name", "description", "category", "validation_status", "compliance_status", "created_at", "updated_at"],
        required: false,
    },
    policy_assets: {
        model: models.policy_assets,
        as: "policy_assets",
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
    policy_compliance: {
        model: models.policy_compliance,
        as: "policy_compliances",
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
        attributes: ["report_id"],
        required: false,
        include: [
            {
                model: models.reports,
                as: "report",
                attributes: ["id", "title", "type", "status", "generated_at"],
                required: false,
            },
        ],
    },
};
