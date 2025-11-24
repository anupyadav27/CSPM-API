import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class assets extends Model {
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
                resource_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                resource_type: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                provider: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                region: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                environment: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                category: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                lifecycle_state: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "active",
                },
                health_status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "healthy",
                },
                metadata: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                updated_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
                },
            },
            {
                sequelize,
                tableName: "assets",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "assets_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                    {
                        name: "idx_assets_lifecycle_health",
                        fields: [{ name: "lifecycle_state" }, { name: "health_status" }],
                    },
                    {
                        name: "idx_assets_region_env",
                        fields: [{ name: "region" }, { name: "environment" }],
                    },
                    {
                        name: "idx_assets_tenant_id",
                        fields: [{ name: "tenant_id" }],
                    },
                    {
                        name: "idx_assets_tenant_resource",
                        unique: true,
                        fields: [{ name: "tenant_id" }, { name: "resource_id" }, { name: "resource_type" }],
                    },
                ],
            }
        );
    }
}
