import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class reports extends Model {
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
                title: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                type: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "pending",
                },
                generated_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                generated_by: {
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
                tableName: "reports",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "idx_reports_tenant_id",
                        fields: [{ name: "tenant_id" }],
                    },
                    {
                        name: "reports_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
