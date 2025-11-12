import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class role_permissions extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                role_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "roles",
                        key: "id",
                    },
                },
                permission_key: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "permissions",
                        key: "key",
                    },
                },
            },
            {
                sequelize,
                tableName: "role_permissions",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "role_permissions_pkey",
                        unique: true,
                        fields: [{ name: "role_id" }, { name: "permission_key" }],
                    },
                ],
            }
        );
    }
}
