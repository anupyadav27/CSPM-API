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
                status: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    defaultValue: "active",
                },
                last_accessed_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                invited_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                joined_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                removed_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
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
                tableName: "tenant_users",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "idx_tenant_users_status",
                        fields: [{ name: "status" }],
                    },
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
