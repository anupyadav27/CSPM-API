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
                attributes: ["id", "name", "severity"],
                required: false,
            },
        ],
    },
};
