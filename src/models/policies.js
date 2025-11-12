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
                    allowNull: false,
                    defaultValue: "Custom",
                },
                type: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "json",
                },
                document: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                version: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 1,
                },
                validation_status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "unknown",
                },
                compliance_status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "unknown",
                },
                enforced_by: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "Manual",
                },
                enforcement_status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "not_enforced",
                },
                created_by: {
                    type: DataTypes.TEXT,
                    allowNull: false,
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
                last_evaluated_at: {
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
                tableName: "policies",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "idx_policies_compliance_enforcement",
                        fields: [{ name: "compliance_status" }, { name: "enforcement_status" }],
                    },
                    {
                        name: "idx_policies_tenant_category_name",
                        fields: [{ name: "tenant_id" }, { name: "category" }, { name: "name" }],
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
