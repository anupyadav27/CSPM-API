import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class cloud_connectors extends Model {
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
                name: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                provider: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                config: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                credentials_type: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                credentials_details: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                credentials_stored_in_secrets_manager: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: true,
                },
                status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "pending",
                },
                last_sync_started_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                last_sync_completed_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                last_sync_status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                last_sync_message: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                health_last_checked: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                health_status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "unknown",
                },
                created_by: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "users",
                        key: "id",
                    },
                },
                updated_by: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "users",
                        key: "id",
                    },
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
                tableName: "cloud_connectors",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "cloud_connectors_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                    {
                        name: "idx_cloud_connectors_health_status",
                        fields: [{ name: "health_status" }],
                    },
                    {
                        name: "idx_cloud_connectors_last_sync_status",
                        fields: [{ name: "last_sync_status" }],
                    },
                    {
                        name: "idx_cloud_connectors_status",
                        fields: [{ name: "status" }],
                    },
                    {
                        name: "idx_cloud_connectors_tenant_provider",
                        fields: [{ name: "tenant_id" }, { name: "provider" }],
                    },
                    {
                        name: "idx_cloud_connectors_updated_at",
                        fields: [{ name: "updated_at", order: "DESC" }],
                    },
                ],
            }
        );
    }
}
