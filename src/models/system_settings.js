import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class system_settings extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                tenant_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "tenants",
                        key: "id",
                    },
                },
                scope: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    defaultValue: "global",
                },
                platform_name: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "Cloud Secure Platform",
                },
                support_email: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "support@example.com",
                },
                timezone: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "UTC",
                },
                locale: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "en-US",
                },
                enable_vulnerability_scan: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: true,
                },
                enable_threat_detection: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: true,
                },
                enable_compliance_monitoring: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: true,
                },
                enable_auto_remediation: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                password_min_length: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 8,
                },
                password_require_numbers: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: true,
                },
                password_require_symbols: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: true,
                },
                password_expire_days: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 90,
                },
                session_timeout_minutes: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 60,
                },
                max_failed_login_attempts: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 5,
                },
                mfa_required: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                aws_access_key_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                aws_secret_access_key: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                aws_regions: {
                    type: DataTypes.ARRAY(DataTypes.TEXT),
                    allowNull: true,
                },
                azure_client_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                azure_client_secret: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                azure_subscription_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                gcp_project_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                gcp_key_file: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                alert_cpu_usage_threshold: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                    defaultValue: 85,
                },
                alert_memory_usage_threshold: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                    defaultValue: 90,
                },
                alert_vuln_critical_count_threshold: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 10,
                },
                updated_by: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "users",
                        key: "id",
                    },
                },
                notes: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn("now"),
                },
                updated_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn("now"),
                },
            },
            {
                sequelize,
                tableName: "system_settings",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "idx_system_settings_tenant_scope",
                        fields: [{ name: "tenant_id" }, { name: "scope" }],
                    },
                    {
                        name: "system_settings_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
