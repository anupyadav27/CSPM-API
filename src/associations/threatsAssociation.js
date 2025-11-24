import { models } from "../config/db.js";

export const ASSOCIATION_MAP = {
    threats: {
        model: models.threats,
        as: "threats",
        attributes: [
            "id",
            "tenant_id",
            "name", // Using 'name' as it matches your DB schema
            "severity",
            "status",
            "description",
            "created_at",
            "updated_at",
        ],
        required: false,
        include: [
            {
                model: models.tenants,
                as: "tenants", // Use the alias defined in belongsTo/hasMany
                attributes: ["id", "name", "status"],
                required: false,
            },
            // Include assets through the junction table
            {
                model: models.assets,
                as: "asset_id_assets_asset_threats", // Use the exact alias defined in belongsToMany
                attributes: [
                    "id",
                    "name",
                    "resource_id",
                    "resource_type",
                    "provider",
                    "region",
                    "environment",
                    "category",
                    "lifecycle_state",
                    "health_status",
                ],
                required: false,
                include: [
                    {
                        model: models.tenants,
                        as: "tenants", // Use the alias defined in belongsTo/hasMany
                        attributes: ["id", "name", "status"],
                        required: false,
                    },
                ],
            },
        ],
    },
    tenants: {
        model: models.tenants,
        as: "tenants",
        attributes: ["id", "name", "status", "plan", "contact_email", "region"],
        required: false,
    },
    // The main association is through the junction table
    asset_threats: {
        model: models.asset_threats,
        as: "asset_threats", // Use the alias defined in belongsTo/hasMany
        attributes: ["asset_id", "threat_id"],
        required: false,
        include: [
            {
                model: models.assets,
                as: "assets", // Use the alias defined in belongsTo/hasMany
                attributes: [
                    "id",
                    "name",
                    "resource_id",
                    "resource_type",
                    "provider",
                    "region",
                    "environment",
                    "category",
                    "lifecycle_state",
                    "health_status",
                ],
                required: false,
            },
            {
                model: models.threats,
                as: "threat", // Use the alias defined in belongsTo
                attributes: ["id", "name", "severity", "status"],
                required: false,
            },
        ],
    },
    threat_remediation_steps: {
        model: models.threat_remediation_steps,
        as: "threat_remediation_steps", // Use the alias defined in belongsTo/hasMany
        attributes: ["id", "threat_id", "step_order", "step_description", "created_at", "updated_at"],
        required: false,
    },
    threat_related_findings: {
        model: models.threat_related_findings,
        as: "threat_related_findings", // Use the alias defined in belongsTo/hasMany
        attributes: ["threat_id", "finding_id", "created_at", "updated_at"],
        required: false,
    },
};
