import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class report_policies extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                report_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "reports",
                        key: "id",
                    },
                },
                policy_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "policies",
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
                tableName: "report_policies",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "report_policies_pkey",
                        unique: true,
                        fields: [{ name: "report_id" }, { name: "policy_id" }],
                    },
                ],
            }
        );
    }
}
