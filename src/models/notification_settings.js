import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class notification_settings extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                tenant_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "tenants",
                        key: "id",
                    },
                },
                user_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "users",
                        key: "id",
                    },
                },
                enabled: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: true,
                },
                email_enabled: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: true,
                },
                webhook_enabled: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
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
                tableName: "notification_settings",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "notification_settings_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
