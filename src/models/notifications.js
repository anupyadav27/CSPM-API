import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class notifications extends Model {
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
                user_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "users",
                        key: "id",
                    },
                },
                title: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                body: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                category: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    defaultValue: "alert",
                },
                channels: {
                    type: DataTypes.ARRAY(DataTypes.TEXT),
                    allowNull: true,
                },
                read: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                read_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                priority: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "medium",
                },
                severity_score: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                external_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                correlation_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                email_attempted: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                email_delivered: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                email_last_attempted_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                email_attempts: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                email_error: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                webhook_attempted: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                webhook_delivered: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                webhook_last_attempted_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                webhook_attempts: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                webhook_last_response_status: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                webhook_error: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                siem_attempted: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                siem_delivered: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                siem_last_attempted_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                siem_attempts: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                siem_error: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                source: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "system",
                },
                action_type: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                action_url: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                action_payload: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                expires_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                payload: {
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
                tableName: "notifications",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "idx_notifications_external_source",
                        fields: [{ name: "external_id" }, { name: "source" }],
                    },
                    {
                        name: "idx_notifications_tenant_read_priority",
                        fields: [
                            { name: "tenant_id" },
                            { name: "read" },
                            { name: "priority", order: "DESC" },
                            { name: "created_at", order: "DESC" },
                        ],
                    },
                    {
                        name: "idx_notifications_tenant_user_created",
                        fields: [
                            { name: "tenant_id" },
                            { name: "user_id" },
                            { name: "created_at", order: "DESC" },
                        ],
                    },
                    {
                        name: "notifications_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
