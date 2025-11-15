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
                    allowNull: false,
                    defaultValue: "aws",
                },
                region: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                environment: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    defaultValue: "production",
                },
                category: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                created_at_cloud: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                lifecycle_state: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    defaultValue: "active",
                },
                last_scanned_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                health_status: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    defaultValue: "unknown",
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
                tableName: "assets",
                schema: "cspm",
                timestamps: false,
                underscored: true,
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
                        name: "idx_assets_tenant_resource",
                        unique: true,
                        fields: [{ name: "tenant_id" }, { name: "resource_id" }, { name: "resource_type" }],
                    },
                ],
            }
        );
    }
}
