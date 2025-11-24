import { models } from "../config/db.js";

export const ASSOCIATION_MAP = {
    tenants: {
        model: models.tenants,
        as: "tenants",
        attributes: ["id", "name"],
        required: false,
    },
    compliance: {
        model: models.compliance,
        as: "compliance",
        attributes: ["id", "framework", "control_id", "control_title", "status", "severity", "last_checked_at"],
        required: false,
    },
    asset_compliance: {
        model: models.asset_compliance,
        as: "asset_compliances",
        attributes: ["compliance_id"],
        required: false,
        include: [
            {
                model: models.compliance,
                as: "compliance",
                attributes: ["id", "framework", "control_id", "control_title", "status", "severity", "last_checked_at"],
                required: false,
            },
        ],
    },
    compliance_remediation_steps: {
        model: models.compliance_remediation_steps,
        as: "compliance_remediation_steps",
        attributes: ["id", "step_order", "step_description"],
        required: false,
    },
    policy_compliance: {
        model: models.policy_compliance,
        as: "policy_compliances",
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
    report_compliance: {
        model: models.report_compliance,
        as: "report_compliances",
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
