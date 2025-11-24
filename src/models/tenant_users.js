import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class tenant_users extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                tenant_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "tenants",
                        key: "id",
                    },
                },
                user_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "users",
                        key: "id",
                    },
                },
                role_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "active",
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
                tableName: "tenant_users",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "tenant_users_pkey",
                        unique: true,
                        fields: [{ name: "tenant_id" }, { name: "user_id" }],
                    },
                ],
            }
        );
    }
}
