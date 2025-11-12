import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class tenants extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    unique: "tenants_name_key",
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    defaultValue: "active",
                },
                plan: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    defaultValue: "standard",
                },
                contact_email: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                logo_url: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                region: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "us-east-1",
                },
                branding_theme_color: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "#5F9C45",
                },
                branding_logo: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                security_sso_enabled: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                integration_aws_enabled: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                integration_slack_enabled: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                integration_siem_enabled: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                billing_subscription_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                billing_plan_start_date: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                billing_plan_end_date: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                billing_payment_status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "active",
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
                tableName: "tenants",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "idx_tenants_status_plan",
                        fields: [{ name: "status" }, { name: "plan" }],
                    },
                    {
                        name: "tenants_name_key",
                        unique: true,
                        fields: [{ name: "name" }],
                    },
                    {
                        name: "tenants_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
