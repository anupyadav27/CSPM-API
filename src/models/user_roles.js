import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class user_roles extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                name: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
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
                        fields: [{ name: "name" }],
                    },
                ],
            }
        );
    }
}
