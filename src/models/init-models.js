import _sequelize, { Op } from "sequelize";

const DataTypes = _sequelize.DataTypes;
import _agents from "./agents.js";
import _android_advisory from "./android_advisory.js";
import _android_cve from "./android_cve.js";
import _asset_compliance from "./asset_compliance.js";
import _asset_tags from "./asset_tags.js";
import _asset_threats from "./asset_threats.js";
import _assets from "./assets.js";
import _audit_logs from "./audit_logs.js";
import _cloud_connectors from "./cloud_connectors.js";
import _compliance from "./compliance.js";
import _compliance_remediation_steps from "./compliance_remediation_steps.js";
import _connector_health_issues from "./connector_health_issues.js";
import _cve_attack_mappings from "./cve_attack_mappings.js";
import _cve_update_marker from "./cve_update_marker.js";
import _cves from "./cves.js";
import _ios_advisory from "./ios_advisory.js";
import _ios_advisory_cve from "./ios_advisory_cve.js";
import _ios_cve from "./ios_cve.js";
import _ios_update from "./ios_update.js";
import _ios_update_cve from "./ios_update_cve.js";
import _mitre_techniques from "./mitre_techniques.js";
import _notification_rules from "./notification_rules.js";
import _notification_settings from "./notification_settings.js";
import _notifications from "./notifications.js";
import _permissions from "./permissions.js";
import _pipeline_executions from "./pipeline_executions.js";
import _pkg_database from "./pkg_database.js";
import _platform_settings from "./platform_settings.js";
import _policies from "./policies.js";
import _policy_assets from "./policy_assets.js";
import _policy_compliance from "./policy_compliance.js";
import _quality_metrics from "./quality_metrics.js";
import _report_assets from "./report_assets.js";
import _report_compliance from "./report_compliance.js";
import _report_policies from "./report_policies.js";
import _reports from "./reports.js";
import _role_permissions from "./role_permissions.js";
import _roles from "./roles.js";
import _scan_vulnerabilities from "./scan_vulnerabilities.js";
import _scans from "./scans.js";
import _source_fetch_audit from "./source_fetch_audit.js";
import _system_settings from "./system_settings.js";
import _tenant_users from "./tenant_users.js";
import _tenants from "./tenants.js";
import _threat_related_findings from "./threat_related_findings.js";
import _threat_remediation_steps from "./threat_remediation_steps.js";
import _threats from "./threats.js";
import _user_roles from "./user_roles.js";
import _user_sessions from "./user_sessions.js";
import _users from "./users.js";
import _vsa_database from "./vsa_database.js";
import _vulnerability_sources from "./vulnerability_sources.js";
import _windows_advisory from "./windows_advisory.js";
import _windows_advisory_cve from "./windows_advisory_cve.js";
import _windows_cve from "./windows_cve.js";
import _windows_cve_product from "./windows_cve_product.js";
import _windows_product from "./windows_product.js";

export default function initModels(sequelize) {
    const agents = _agents.init(sequelize, DataTypes);
    const android_advisory = _android_advisory.init(sequelize, DataTypes);
    const android_cve = _android_cve.init(sequelize, DataTypes);
    const asset_compliance = _asset_compliance.init(sequelize, DataTypes);
    const asset_tags = _asset_tags.init(sequelize, DataTypes);
    const asset_threats = _asset_threats.init(sequelize, DataTypes);
    const assets = _assets.init(sequelize, DataTypes);
    const audit_logs = _audit_logs.init(sequelize, DataTypes);
    const cloud_connectors = _cloud_connectors.init(sequelize, DataTypes);
    const compliance = _compliance.init(sequelize, DataTypes);
    const compliance_remediation_steps = _compliance_remediation_steps.init(sequelize, DataTypes);
    const connector_health_issues = _connector_health_issues.init(sequelize, DataTypes);
    const cve_attack_mappings = _cve_attack_mappings.init(sequelize, DataTypes);
    const cve_update_marker = _cve_update_marker.init(sequelize, DataTypes);
    const cves = _cves.init(sequelize, DataTypes);
    const ios_advisory = _ios_advisory.init(sequelize, DataTypes);
    const ios_advisory_cve = _ios_advisory_cve.init(sequelize, DataTypes);
    const ios_cve = _ios_cve.init(sequelize, DataTypes);
    const ios_update = _ios_update.init(sequelize, DataTypes);
    const ios_update_cve = _ios_update_cve.init(sequelize, DataTypes);
    const mitre_techniques = _mitre_techniques.init(sequelize, DataTypes);
    const notification_rules = _notification_rules.init(sequelize, DataTypes);
    const notification_settings = _notification_settings.init(sequelize, DataTypes);
    const notifications = _notifications.init(sequelize, DataTypes);
    const permissions = _permissions.init(sequelize, DataTypes);
    const pipeline_executions = _pipeline_executions.init(sequelize, DataTypes);
    const pkg_database = _pkg_database.init(sequelize, DataTypes);
    const platform_settings = _platform_settings.init(sequelize, DataTypes);
    const policies = _policies.init(sequelize, DataTypes);
    const policy_assets = _policy_assets.init(sequelize, DataTypes);
    const policy_compliance = _policy_compliance.init(sequelize, DataTypes);
    const quality_metrics = _quality_metrics.init(sequelize, DataTypes);
    const report_assets = _report_assets.init(sequelize, DataTypes);
    const report_compliance = _report_compliance.init(sequelize, DataTypes);
    const report_policies = _report_policies.init(sequelize, DataTypes);
    const reports = _reports.init(sequelize, DataTypes);
    const role_permissions = _role_permissions.init(sequelize, DataTypes);
    const roles = _roles.init(sequelize, DataTypes);
    const scan_vulnerabilities = _scan_vulnerabilities.init(sequelize, DataTypes);
    const scans = _scans.init(sequelize, DataTypes);
    const source_fetch_audit = _source_fetch_audit.init(sequelize, DataTypes);
    const system_settings = _system_settings.init(sequelize, DataTypes);
    const tenant_users = _tenant_users.init(sequelize, DataTypes);
    const tenants = _tenants.init(sequelize, DataTypes);
    const threat_related_findings = _threat_related_findings.init(sequelize, DataTypes);
    const threat_remediation_steps = _threat_remediation_steps.init(sequelize, DataTypes);
    const threats = _threats.init(sequelize, DataTypes);
    const user_roles = _user_roles.init(sequelize, DataTypes);
    const user_sessions = _user_sessions.init(sequelize, DataTypes);
    const users = _users.init(sequelize, DataTypes);
    const vsa_database = _vsa_database.init(sequelize, DataTypes);
    const vulnerability_sources = _vulnerability_sources.init(sequelize, DataTypes);
    const windows_advisory = _windows_advisory.init(sequelize, DataTypes);
    const windows_advisory_cve = _windows_advisory_cve.init(sequelize, DataTypes);
    const windows_cve = _windows_cve.init(sequelize, DataTypes);
    const windows_cve_product = _windows_cve_product.init(sequelize, DataTypes);
    const windows_product = _windows_product.init(sequelize, DataTypes);

    assets.belongsToMany(compliance, {
        as: "compliance_id_compliances",
        through: asset_compliance,
        foreignKey: "asset_id",
        otherKey: "compliance_id",
    });
    assets.belongsToMany(policies, {
        as: "policy_id_policies",
        through: policy_assets,
        foreignKey: "asset_id",
        otherKey: "policy_id",
    });
    assets.belongsToMany(reports, {
        as: "report_id_reports",
        through: report_assets,
        foreignKey: "asset_id",
        otherKey: "report_id",
    });
    assets.belongsToMany(threats, {
        as: "threat_id_threats",
        through: asset_threats,
        foreignKey: "asset_id",
        otherKey: "threat_id",
    });
    compliance.belongsToMany(assets, {
        as: "asset_id_assets",
        through: asset_compliance,
        foreignKey: "compliance_id",
        otherKey: "asset_id",
    });
    compliance.belongsToMany(policies, {
        as: "policy_id_policies_policy_compliances",
        through: policy_compliance,
        foreignKey: "compliance_id",
        otherKey: "policy_id",
    });
    compliance.belongsToMany(reports, {
        as: "report_id_reports_report_compliances",
        through: report_compliance,
        foreignKey: "compliance_id",
        otherKey: "report_id",
    });
    ios_advisory.belongsToMany(ios_cve, {
        as: "cve_id_ios_cves",
        through: ios_advisory_cve,
        foreignKey: "advisory_id",
        otherKey: "cve_id",
    });
    ios_cve.belongsToMany(ios_advisory, {
        as: "advisory_id_ios_advisories",
        through: ios_advisory_cve,
        foreignKey: "cve_id",
        otherKey: "advisory_id",
    });
    ios_cve.belongsToMany(ios_update, {
        as: "update_id_ios_updates",
        through: ios_update_cve,
        foreignKey: "cve_id",
        otherKey: "update_id",
    });
    ios_update.belongsToMany(ios_cve, {
        as: "cve_id_ios_cve_ios_update_cves",
        through: ios_update_cve,
        foreignKey: "update_id",
        otherKey: "cve_id",
    });
    permissions.belongsToMany(roles, {
        as: "role_id_roles",
        through: role_permissions,
        foreignKey: "permission_key",
        otherKey: "role_id",
    });
    policies.belongsToMany(assets, {
        as: "asset_id_assets_policy_assets",
        through: policy_assets,
        foreignKey: "policy_id",
        otherKey: "asset_id",
    });
    policies.belongsToMany(compliance, {
        as: "compliance_id_compliance_policy_compliances",
        through: policy_compliance,
        foreignKey: "policy_id",
        otherKey: "compliance_id",
    });
    policies.belongsToMany(reports, {
        as: "report_id_reports_report_policies",
        through: report_policies,
        foreignKey: "policy_id",
        otherKey: "report_id",
    });
    reports.belongsToMany(assets, {
        as: "asset_id_assets_report_assets",
        through: report_assets,
        foreignKey: "report_id",
        otherKey: "asset_id",
    });
    reports.belongsToMany(compliance, {
        as: "compliance_id_compliance_report_compliances",
        through: report_compliance,
        foreignKey: "report_id",
        otherKey: "compliance_id",
    });
    reports.belongsToMany(policies, {
        as: "policy_id_policies_report_policies",
        through: report_policies,
        foreignKey: "report_id",
        otherKey: "policy_id",
    });
    roles.belongsToMany(permissions, {
        as: "permission_key_permissions",
        through: role_permissions,
        foreignKey: "role_id",
        otherKey: "permission_key",
    });
    tenants.belongsToMany(users, {
        as: "user_id_users",
        through: tenant_users,
        foreignKey: "tenant_id",
        otherKey: "user_id",
        scope: { role_id: { [Op.col]: "tenant_users.role_id" } },
    });
    threats.belongsToMany(assets, {
        as: "asset_id_assets_asset_threats",
        through: asset_threats,
        foreignKey: "threat_id",
        otherKey: "asset_id",
    });
    users.belongsToMany(tenants, {
        as: "tenant_id_tenants",
        through: tenant_users,
        foreignKey: "user_id",
        otherKey: "tenant_id",
        scope: { role_id: { [Op.col]: "tenant_users.role_id" } },
    });
    windows_advisory.belongsToMany(windows_cve, {
        as: "cve_id_windows_cves",
        through: windows_advisory_cve,
        foreignKey: "advisory_id",
        otherKey: "cve_id",
    });
    windows_cve.belongsToMany(windows_advisory, {
        as: "advisory_id_windows_advisories",
        through: windows_advisory_cve,
        foreignKey: "cve_id",
        otherKey: "advisory_id",
    });
    windows_cve.belongsToMany(windows_product, {
        as: "product_id_windows_products",
        through: windows_cve_product,
        foreignKey: "cve_id",
        otherKey: "product_id",
    });
    windows_product.belongsToMany(windows_cve, {
        as: "cve_id_windows_cve_windows_cve_products",
        through: windows_cve_product,
        foreignKey: "product_id",
        otherKey: "cve_id",
    });
    android_cve.belongsTo(android_advisory, { as: "advisory", foreignKey: "advisory_id" });
    android_advisory.hasMany(android_cve, { as: "android_cves", foreignKey: "advisory_id" });
    asset_compliance.belongsTo(assets, { as: "asset", foreignKey: "asset_id" });
    assets.hasMany(asset_compliance, { as: "asset_compliance", foreignKey: "asset_id" });
    asset_tags.belongsTo(assets, { as: "asset", foreignKey: "asset_id" });
    assets.hasMany(asset_tags, { as: "asset_tags", foreignKey: "asset_id" });
    asset_threats.belongsTo(assets, { as: "asset", foreignKey: "asset_id" });
    assets.hasMany(asset_threats, { as: "asset_threats", foreignKey: "asset_id" });
    policy_assets.belongsTo(assets, { as: "asset", foreignKey: "asset_id" });
    assets.hasMany(policy_assets, { as: "policy_assets", foreignKey: "asset_id" });
    report_assets.belongsTo(assets, { as: "asset", foreignKey: "asset_id" });
    assets.hasMany(report_assets, { as: "report_assets", foreignKey: "asset_id" });
    threats.belongsTo(assets, { as: "asset", foreignKey: "asset_id" });
    assets.hasMany(threats, { as: "threats", foreignKey: "asset_id" });
    connector_health_issues.belongsTo(cloud_connectors, {
        as: "connector",
        foreignKey: "connector_id",
    });
    cloud_connectors.hasMany(connector_health_issues, {
        as: "connector_health_issues",
        foreignKey: "connector_id",
    });
    asset_compliance.belongsTo(compliance, { as: "compliance", foreignKey: "compliance_id" });
    compliance.hasMany(asset_compliance, { as: "asset_compliance", foreignKey: "compliance_id" });
    compliance_remediation_steps.belongsTo(compliance, {
        as: "compliance",
        foreignKey: "compliance_id",
    });
    compliance.hasMany(compliance_remediation_steps, {
        as: "compliance_remediation_steps",
        foreignKey: "compliance_id",
    });
    policy_compliance.belongsTo(compliance, { as: "compliance", foreignKey: "compliance_id" });
    compliance.hasMany(policy_compliance, {
        as: "policy_compliances",
        foreignKey: "compliance_id",
    });
    report_compliance.belongsTo(compliance, { as: "compliance", foreignKey: "compliance_id" });
    compliance.hasMany(report_compliance, {
        as: "report_compliances",
        foreignKey: "compliance_id",
    });
    cve_attack_mappings.belongsTo(cves, { as: "cve", foreignKey: "cve_id" });
    cves.hasMany(cve_attack_mappings, { as: "cve_attack_mappings", foreignKey: "cve_id" });
    ios_advisory_cve.belongsTo(ios_advisory, { as: "advisory", foreignKey: "advisory_id" });
    ios_advisory.hasMany(ios_advisory_cve, { as: "ios_advisory_cves", foreignKey: "advisory_id" });
    ios_advisory_cve.belongsTo(ios_cve, { as: "cve", foreignKey: "cve_id" });
    ios_cve.hasMany(ios_advisory_cve, { as: "ios_advisory_cves", foreignKey: "cve_id" });
    ios_update_cve.belongsTo(ios_cve, { as: "cve", foreignKey: "cve_id" });
    ios_cve.hasMany(ios_update_cve, { as: "ios_update_cves", foreignKey: "cve_id" });
    ios_update_cve.belongsTo(ios_update, { as: "update", foreignKey: "update_id" });
    ios_update.hasMany(ios_update_cve, { as: "ios_update_cves", foreignKey: "update_id" });
    cve_attack_mappings.belongsTo(mitre_techniques, {
        as: "technique",
        foreignKey: "technique_id",
    });
    mitre_techniques.hasMany(cve_attack_mappings, {
        as: "cve_attack_mappings",
        foreignKey: "technique_id",
    });
    notification_rules.belongsTo(notification_settings, {
        as: "setting",
        foreignKey: "settings_id",
    });
    notification_settings.hasMany(notification_rules, {
        as: "notification_rules",
        foreignKey: "settings_id",
    });
    role_permissions.belongsTo(permissions, {
        as: "permission_key_permission",
        foreignKey: "permission_key",
    });
    permissions.hasMany(role_permissions, { as: "role_permissions", foreignKey: "permission_key" });
    quality_metrics.belongsTo(pipeline_executions, {
        as: "pipeline_run",
        foreignKey: "pipeline_run_id",
    });
    pipeline_executions.hasMany(quality_metrics, {
        as: "quality_metrics",
        foreignKey: "pipeline_run_id",
    });
    source_fetch_audit.belongsTo(pipeline_executions, {
        as: "pipeline_run",
        foreignKey: "pipeline_run_id",
    });
    pipeline_executions.hasMany(source_fetch_audit, {
        as: "source_fetch_audits",
        foreignKey: "pipeline_run_id",
    });
    policy_assets.belongsTo(policies, { as: "policy", foreignKey: "policy_id" });
    policies.hasMany(policy_assets, { as: "policy_assets", foreignKey: "policy_id" });
    policy_compliance.belongsTo(policies, { as: "policy", foreignKey: "policy_id" });
    policies.hasMany(policy_compliance, { as: "policy_compliances", foreignKey: "policy_id" });
    report_policies.belongsTo(policies, { as: "policy", foreignKey: "policy_id" });
    policies.hasMany(report_policies, { as: "report_policies", foreignKey: "policy_id" });
    report_assets.belongsTo(reports, { as: "report", foreignKey: "report_id" });
    reports.hasMany(report_assets, { as: "report_assets", foreignKey: "report_id" });
    report_compliance.belongsTo(reports, { as: "report", foreignKey: "report_id" });
    reports.hasMany(report_compliance, { as: "report_compliances", foreignKey: "report_id" });
    report_policies.belongsTo(reports, { as: "report", foreignKey: "report_id" });
    reports.hasMany(report_policies, { as: "report_policies", foreignKey: "report_id" });
    role_permissions.belongsTo(roles, { as: "role", foreignKey: "role_id" });
    roles.hasMany(role_permissions, { as: "role_permissions", foreignKey: "role_id" });
    scan_vulnerabilities.belongsTo(scans, { as: "scan", foreignKey: "scan_id" });
    scans.hasMany(scan_vulnerabilities, { as: "scan_vulnerabilities", foreignKey: "scan_id" });
    agents.belongsTo(tenants, { as: "tenants", foreignKey: "tenant_id" });
    tenants.hasMany(agents, { as: "agents", foreignKey: "tenant_id" });
    assets.belongsTo(tenants, { as: "tenants", foreignKey: "tenant_id" });
    tenants.hasMany(assets, { as: "assets", foreignKey: "tenant_id" });
    audit_logs.belongsTo(tenants, { as: "tenants", foreignKey: "tenant_id" });
    tenants.hasMany(audit_logs, { as: "audit_logs", foreignKey: "tenant_id" });
    cloud_connectors.belongsTo(tenants, { as: "tenants", foreignKey: "tenant_id" });
    tenants.hasMany(cloud_connectors, { as: "cloud_connectors", foreignKey: "tenant_id" });
    compliance.belongsTo(tenants, { as: "tenants", foreignKey: "tenant_id" });
    tenants.hasMany(compliance, { as: "compliances", foreignKey: "tenant_id" });
    cve_update_marker.belongsTo(tenants, { as: "tenants", foreignKey: "tenant_id" });
    tenants.hasMany(cve_update_marker, { as: "cve_update_markers", foreignKey: "tenant_id" });
    notification_settings.belongsTo(tenants, { as: "tenants", foreignKey: "tenant_id" });
    tenants.hasMany(notification_settings, {
        as: "notification_settings",
        foreignKey: "tenant_id",
    });
    notifications.belongsTo(tenants, { as: "tenants", foreignKey: "tenant_id" });
    tenants.hasMany(notifications, { as: "notifications", foreignKey: "tenant_id" });
    pkg_database.belongsTo(tenants, { as: "tenants", foreignKey: "tenant_id" });
    tenants.hasMany(pkg_database, { as: "pkg_databases", foreignKey: "tenant_id" });
    policies.belongsTo(tenants, { as: "tenants", foreignKey: "tenant_id" });
    tenants.hasMany(policies, { as: "policies", foreignKey: "tenant_id" });
    reports.belongsTo(tenants, { as: "tenants", foreignKey: "tenant_id" });
    tenants.hasMany(reports, { as: "reports", foreignKey: "tenant_id" });
    scan_vulnerabilities.belongsTo(tenants, { as: "tenants", foreignKey: "tenant_id" });
    tenants.hasMany(scan_vulnerabilities, { as: "scan_vulnerabilities", foreignKey: "tenant_id" });
    scans.belongsTo(tenants, { as: "tenants", foreignKey: "tenant_id" });
    tenants.hasMany(scans, { as: "scans", foreignKey: "tenant_id" });
    system_settings.belongsTo(tenants, { as: "tenants", foreignKey: "tenant_id" });
    tenants.hasMany(system_settings, { as: "system_settings", foreignKey: "tenant_id" });
    tenant_users.belongsTo(tenants, { as: "tenants", foreignKey: "tenant_id" });
    tenants.hasMany(tenant_users, { as: "tenant_users", foreignKey: "tenant_id" });
    threats.belongsTo(tenants, { as: "tenants", foreignKey: "tenant_id" });
    tenants.hasMany(threats, { as: "threats", foreignKey: "tenant_id" });
    asset_threats.belongsTo(threats, { as: "threat", foreignKey: "threat_id" });
    threats.hasMany(asset_threats, { as: "asset_threats", foreignKey: "threat_id" });
    threat_related_findings.belongsTo(threats, { as: "threat", foreignKey: "threat_id" });
    threats.hasMany(threat_related_findings, {
        as: "threat_related_findings",
        foreignKey: "threat_id",
    });
    threat_remediation_steps.belongsTo(threats, { as: "threat", foreignKey: "threat_id" });
    threats.hasMany(threat_remediation_steps, {
        as: "threat_remediation_steps",
        foreignKey: "threat_id",
    });
    audit_logs.belongsTo(users, { as: "user", foreignKey: "user_id" });
    users.hasMany(audit_logs, { as: "audit_logs", foreignKey: "user_id" });
    cloud_connectors.belongsTo(users, { as: "created_by_user", foreignKey: "created_by" });
    users.hasMany(cloud_connectors, { as: "cloud_connectors", foreignKey: "created_by" });
    cloud_connectors.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by" });
    users.hasMany(cloud_connectors, {
        as: "updated_by_cloud_connectors",
        foreignKey: "updated_by",
    });
    notification_settings.belongsTo(users, { as: "user", foreignKey: "user_id" });
    users.hasMany(notification_settings, { as: "notification_settings", foreignKey: "user_id" });
    notifications.belongsTo(users, { as: "user", foreignKey: "user_id" });
    users.hasMany(notifications, { as: "notifications", foreignKey: "user_id" });
    permissions.belongsTo(users, { as: "created_by_user", foreignKey: "created_by" });
    users.hasMany(permissions, { as: "permissions", foreignKey: "created_by" });
    permissions.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by" });
    users.hasMany(permissions, { as: "updated_by_permissions", foreignKey: "updated_by" });
    platform_settings.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by" });
    users.hasMany(platform_settings, { as: "platform_settings", foreignKey: "updated_by" });
    policies.belongsTo(users, { as: "created_by_user", foreignKey: "created_by" });
    users.hasMany(policies, { as: "policies", foreignKey: "created_by" });
    policies.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by" });
    users.hasMany(policies, { as: "updated_by_policies", foreignKey: "updated_by" });
    reports.belongsTo(users, { as: "generated_by_user", foreignKey: "generated_by" });
    users.hasMany(reports, { as: "reports", foreignKey: "generated_by" });
    roles.belongsTo(users, { as: "created_by_user", foreignKey: "created_by" });
    users.hasMany(roles, { as: "roles", foreignKey: "created_by" });
    roles.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by" });
    users.hasMany(roles, { as: "updated_by_roles", foreignKey: "updated_by" });
    system_settings.belongsTo(users, { as: "updated_by_user", foreignKey: "updated_by" });
    users.hasMany(system_settings, { as: "system_settings", foreignKey: "updated_by" });
    tenant_users.belongsTo(users, { as: "user", foreignKey: "user_id" });
    tenant_users.belongsTo(roles, { as: "role", foreignKey: "role_id" });
    roles.hasMany(tenant_users, { as: "tenant_users", foreignKey: "role_id" });
    users.hasMany(tenant_users, { as: "tenant_users", foreignKey: "user_id" });

    user_roles.belongsTo(users, { as: "user", foreignKey: "user_id" });
    users.hasMany(user_roles, { as: "user_roles", foreignKey: "user_id" });

    user_roles.belongsTo(roles, { as: "role", foreignKey: "role_id" });
    roles.hasMany(user_roles, { as: "user_roles", foreignKey: "role_id" });

    user_sessions.belongsTo(users, { as: "user", foreignKey: "user_id" });
    users.hasMany(user_sessions, { as: "user_sessions", foreignKey: "user_id" });
    cve_update_marker.belongsTo(vulnerability_sources, { as: "source", foreignKey: "source_id" });
    vulnerability_sources.hasOne(cve_update_marker, {
        as: "cve_update_marker",
        foreignKey: "source_id",
    });
    cves.belongsTo(vulnerability_sources, { as: "source", foreignKey: "source_id" });
    vulnerability_sources.hasMany(cves, { as: "cves", foreignKey: "source_id" });
    quality_metrics.belongsTo(vulnerability_sources, { as: "source", foreignKey: "source_id" });
    vulnerability_sources.hasMany(quality_metrics, {
        as: "quality_metrics",
        foreignKey: "source_id",
    });
    source_fetch_audit.belongsTo(vulnerability_sources, { as: "source", foreignKey: "source_id" });
    vulnerability_sources.hasMany(source_fetch_audit, {
        as: "source_fetch_audits",
        foreignKey: "source_id",
    });
    windows_advisory_cve.belongsTo(windows_advisory, { as: "advisory", foreignKey: "advisory_id" });
    windows_advisory.hasMany(windows_advisory_cve, {
        as: "windows_advisory_cves",
        foreignKey: "advisory_id",
    });
    windows_advisory_cve.belongsTo(windows_cve, { as: "cve", foreignKey: "cve_id" });
    windows_cve.hasMany(windows_advisory_cve, {
        as: "windows_advisory_cves",
        foreignKey: "cve_id",
    });
    windows_cve_product.belongsTo(windows_cve, { as: "cve", foreignKey: "cve_id" });
    windows_cve.hasMany(windows_cve_product, { as: "windows_cve_products", foreignKey: "cve_id" });
    windows_cve_product.belongsTo(windows_product, { as: "product", foreignKey: "product_id" });
    windows_product.hasMany(windows_cve_product, {
        as: "windows_cve_products",
        foreignKey: "product_id",
    });

    return {
        agents,
        android_advisory,
        android_cve,
        asset_compliance,
        asset_tags,
        asset_threats,
        assets,
        audit_logs,
        cloud_connectors,
        compliance,
        compliance_remediation_steps,
        connector_health_issues,
        cve_attack_mappings,
        cve_update_marker,
        cves,
        ios_advisory,
        ios_advisory_cve,
        ios_cve,
        ios_update,
        ios_update_cve,
        mitre_techniques,
        notification_rules,
        notification_settings,
        notifications,
        permissions,
        pipeline_executions,
        pkg_database,
        platform_settings,
        policies,
        policy_assets,
        policy_compliance,
        quality_metrics,
        report_assets,
        report_compliance,
        report_policies,
        reports,
        role_permissions,
        roles,
        scan_vulnerabilities,
        scans,
        source_fetch_audit,
        system_settings,
        tenant_users,
        tenants,
        threat_related_findings,
        threat_remediation_steps,
        threats,
        user_roles,
        user_sessions,
        users,
        vsa_database,
        vulnerability_sources,
        windows_advisory,
        windows_advisory_cve,
        windows_cve,
        windows_cve_product,
        windows_product,
    };
}
