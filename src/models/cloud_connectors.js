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
                name: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                provider: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "active",
                },
                health_status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "healthy",
                },
                config: {
                    type: DataTypes.JSONB,
                    allowNull: true,
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
                tenant_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    references: {
                        model: "tenants",
                        key: "id",
                    },
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
                tableName: "cloud_connectors",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "cloud_connectors_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
