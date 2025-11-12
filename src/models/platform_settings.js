import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class platform_settings extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                key: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    unique: "platform_settings_key_key",
                },
                value: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                updated_by: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "users",
                        key: "id",
                    },
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
                tableName: "platform_settings",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "idx_platform_settings_key",
                        fields: [{ name: "key" }],
                    },
                    {
                        name: "idx_platform_settings_updated_at",
                        fields: [{ name: "updated_at", order: "DESC" }],
                    },
                    {
                        name: "platform_settings_key_key",
                        unique: true,
                        fields: [{ name: "key" }],
                    },
                    {
                        name: "platform_settings_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
