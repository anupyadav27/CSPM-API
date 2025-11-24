import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class report_compliance extends Model {
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
                compliance_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "compliance",
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
                tableName: "report_compliance",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "report_compliance_pkey",
                        unique: true,
                        fields: [{ name: "report_id" }, { name: "compliance_id" }],
                    },
                ],
            }
        );
    }
}
