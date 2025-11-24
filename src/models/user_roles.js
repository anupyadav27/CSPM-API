import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class user_roles extends Model {
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
                role_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "roles",
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
                tableName: "user_roles",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
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
