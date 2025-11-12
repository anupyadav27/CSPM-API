import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class audit_logs extends Model {
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
                    allowNull: false,
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
                action: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                entity_type: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                entity_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                ip_address: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                user_agent: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                request_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                method: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                endpoint: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                before_state: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                after_state: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                severity: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "info",
                },
                source: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "user",
                },
                log_timestamp: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn("now"),
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
                tableName: "audit_logs",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "audit_logs_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                    {
                        name: "idx_audit_logs_entity",
                        fields: [{ name: "entity_type" }, { name: "entity_id" }],
                    },
                    {
                        name: "idx_audit_logs_tenant_action",
                        fields: [{ name: "tenant_id" }, { name: "action" }],
                    },
                    {
                        name: "idx_audit_logs_timestamp",
                        fields: [{ name: "log_timestamp", order: "DESC" }],
                    },
                ],
            }
        );
    }
}
