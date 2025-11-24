import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class users extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                email: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    unique: "users_email_key",
                },
                password_hash: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                sso_provider: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                sso_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                name_first: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                name_last: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "active",
                },
                last_login: {
                    type: DataTypes.DATE,
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
                tableName: "users",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "users_email_key",
                        unique: true,
                        fields: [{ name: "email" }],
                    },
                    {
                        name: "users_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
