import { models } from "../config/db.js";

export const ASSOCIATION_MAP = {
    agents: {
        model: models.agents,
        as: "agents",
        attributes: ["id", "name", "status", "last_seen"],
        required: false,
    },
    assets: {
        model: models.assets,
        as: "assets",
        attributes: ["id", "name", "type", "status"],
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
    cloud_connectors: {
        model: models.cloud_connectors,
        as: "cloud_connectors",
        attributes: ["id", "name", "type", "status"],
        required: false,
        include: [
            {
                model: models.users,
                as: "created_by_user",
                attributes: ["id", "username", "email"],
                required: false,
            },
            {
                model: models.users,
                as: "updated_by_user",
                attributes: ["id", "username", "email"],
                required: false,
            },
        ],
    },
    compliance: {
        model: models.compliance,
        as: "compliances",
        attributes: ["id", "name", "standard", "status"],
        required: false,
    },
    cve_update_marker: {
        model: models.cve_update_marker,
        as: "cve_update_markers",
        attributes: ["id", "last_updated", "source_id"],
        required: false,
        include: [
            {
                model: models.vulnerability_sources,
                as: "source",
                attributes: ["id", "name", "type"],
                required: false,
            },
        ],
    },
    notification_settings: {
        model: models.notification_settings,
        as: "notification_settings",
        attributes: ["id", "email_notifications", "webhook_url"],
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
    notifications: {
        model: models.notifications,
        as: "notifications",
        attributes: ["id", "title", "message", "status", "created_at"],
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
    pkg_database: {
        model: models.pkg_database,
        as: "pkg_databases",
        attributes: ["id", "database_name", "version"],
        required: false,
    },
    policies: {
        model: models.policies,
        as: "policies",
        attributes: ["id", "name", "description", "status"],
        required: false,
        include: [
            {
                model: models.users,
                as: "created_by_user",
                attributes: ["id", "username", "email"],
                required: false,
            },
            {
                model: models.users,
                as: "updated_by_user",
                attributes: ["id", "username", "email"],
                required: false,
            },
        ],
    },
    reports: {
        model: models.reports,
        as: "reports",
        attributes: ["id", "name", "type", "status", "generated_at"],
        required: false,
        include: [
            {
                model: models.users,
                as: "generated_by_user",
                attributes: ["id", "username", "email"],
                required: false,
            },
        ],
    },
    scan_vulnerabilities: {
        model: models.scan_vulnerabilities,
        as: "scan_vulnerabilities",
        attributes: ["id", "vulnerability_id", "severity", "status"],
        required: false,
    },
    scans: {
        model: models.scans,
        as: "scans",
        attributes: ["id", "name", "status", "started_at", "completed_at"],
        required: false,
    },
    system_settings: {
        model: models.system_settings,
        as: "system_settings",
        attributes: ["id", "setting_key", "setting_value"],
        required: false,
        include: [
            {
                model: models.users,
                as: "updated_by_user",
                attributes: ["id", "username", "email"],
                required: false,
            },
        ],
    },
    tenant_users: {
        model: models.tenant_users,
        as: "tenant_users",
        attributes: ["user_id", "role_id"],
        required: false,
        include: [
            {
                model: models.users,
                as: "user",
                attributes: ["id", "email", "name_first", "name_first"],
                required: false,
            },
            {
                model: models.roles,
                as: "role",
                attributes: ["id", "name", "description"],
                required: false,
            },
        ],
    },
    threats: {
        model: models.threats,
        as: "threats",
        attributes: ["id", "name", "severity", "status", "description"],
        required: false,
    },
    user_roles: {
        model: models.user_roles,
        as: "user_roles",
        attributes: ["id", "name", "description"],
        required: false,
    },
    user_sessions: {
        model: models.user_sessions,
        as: "user_sessions",
        attributes: ["id", "token", "expires_at", "ip_address", "user_agent"],
        required: false,
        include: [
            {
                model: models.users,
                as: "user",
                attributes: ["id", "username", "email", "first_name", "last_name"],
                required: false,
            },
        ],
    },
    users: {
        model: models.users,
        as: "users",
        attributes: ["id", "username", "email", "first_name", "last_name", "status"],
        required: false,
    },
    vulnerability_sources: {
        model: models.vulnerability_sources,
        as: "vulnerability_sources",
        attributes: ["id", "name", "type", "status"],
        required: false,
    },
};
