import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class policies extends Model {
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
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                category: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                validation_status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "pending",
                },
                compliance_status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "non_compliant",
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
                tableName: "policies",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "idx_policies_tenant_id",
                        fields: [{ name: "tenant_id" }],
                    },
                    {
                        name: "policies_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
