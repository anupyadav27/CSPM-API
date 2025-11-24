import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class notification_rules extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                settings_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    references: {
                        model: "notification_settings",
                        key: "id",
                    },
                },
                rule_name: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                rule_enabled: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: true,
                },
                rule_match: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                rule_actions: {
                    type: DataTypes.TEXT,
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
                tableName: "notification_rules",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "notification_rules_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
