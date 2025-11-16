import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class user_roles extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                user_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: {
                            tableName: "users",
                            schema: "cspm",
                        },
                        key: "id",
                    },
                },
                role_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: {
                            tableName: "roles",
                            schema: "cspm",
                        },
                        key: "id",
                    },
                },
            },
            {
                sequelize,
                tableName: "user_roles",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "user_roles_pkey",
                        unique: true,
                        fields: [{ name: "user_id" }, { name: "role_id" }],
                    },
                ],
            }
        );
    }
}
