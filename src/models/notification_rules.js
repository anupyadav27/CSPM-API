import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class notification_rules extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
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
                    defaultValue: Sequelize.Sequelize.fn("now"),
                },
            },
            {
                sequelize,
                tableName: "notification_rules",
                schema: "cspm",
                timestamps: false,
                underscored: true,
            }
        );
    }
}
