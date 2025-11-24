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
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "active",
                },
                plan: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                contact_email: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                region: {
                    type: DataTypes.TEXT,
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
                tableName: "tenants",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "idx_tenants_status_plan",
                        fields: [{ name: "status" }, { name: "plan" }],
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
