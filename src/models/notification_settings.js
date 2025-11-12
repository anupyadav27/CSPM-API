import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class notification_settings extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                user_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "users",
                        key: "id",
                    },
                    unique: "notification_settings_tenant_id_user_id_key",
                },
                tenant_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    references: {
                        model: "tenants",
                        key: "id",
                    },
                    unique: "notification_settings_tenant_id_user_id_key",
                },
                enabled: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: true,
                },
                in_app_enabled: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: true,
                },
                in_app_digest: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "realtime",
                },
                in_app_severity_threshold: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "low",
                },
                email_enabled: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: true,
                },
                email_address: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                email_digest: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "realtime",
                },
                email_alert_template_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                email_severity_threshold: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "low",
                },
                webhook_enabled: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                webhook_url: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                webhook_headers: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                webhook_auth: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                webhook_retry_max_attempts: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 3,
                },
                webhook_retry_backoff_seconds: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 30,
                },
                webhook_severity_threshold: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "high",
                },
                siem_enabled: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                siem_connector_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                siem_index_name: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                siem_severity_threshold: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "high",
                },
                slack_enabled: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                slack_channel: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                slack_webhook_url: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                pagerduty_enabled: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                pagerduty_integration_key: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                last_tested_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                last_test_result: {
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
                tableName: "notification_settings",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "idx_notification_settings_tenant_user",
                        fields: [{ name: "tenant_id" }, { name: "user_id" }],
                    },
                    {
                        name: "idx_notification_settings_webhook_enabled",
                        fields: [{ name: "webhook_enabled" }],
                    },
                    {
                        name: "notification_settings_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                    {
                        name: "notification_settings_tenant_id_user_id_key",
                        unique: true,
                        fields: [{ name: "tenant_id" }, { name: "user_id" }],
                    },
                ],
            }
        );
    }
}
