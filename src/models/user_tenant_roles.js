import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class user_tenant_roles extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                user_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "users",
                        key: "id",
                    },
                },
                tenant_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "tenants",
                        key: "id",
                    },
                },
                role_name: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "user_roles",
                        key: "name",
                    },
                },
            },
            {
                sequelize,
                tableName: "user_tenant_roles",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "user_tenant_roles_pkey",
                        unique: true,
                        fields: [{ name: "user_id" }, { name: "tenant_id" }, { name: "role_name" }],
                    },
                ],
            }
        );
    }
}
