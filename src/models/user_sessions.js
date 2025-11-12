import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class user_sessions extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                user_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    references: {
                        model: "users",
                        key: "id",
                    },
                },
                token: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    unique: "user_sessions_token_key",
                },
                refresh_token: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                ip_address: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                user_agent: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                login_method: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    defaultValue: "local",
                },
                expires_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                revoked: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                location_country: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                location_city: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                location_region: {
                    type: DataTypes.TEXT,
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
                session_index: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "user_sessions",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "idx_user_sessions_expires_at",
                        fields: [{ name: "expires_at" }],
                    },
                    {
                        name: "idx_user_sessions_revoked",
                        fields: [{ name: "revoked" }],
                    },
                    {
                        name: "idx_user_sessions_user_id",
                        fields: [{ name: "user_id" }],
                    },
                    {
                        name: "user_sessions_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                    {
                        name: "user_sessions_token_key",
                        unique: true,
                        fields: [{ name: "token" }],
                    },
                ],
            }
        );
    }
}
