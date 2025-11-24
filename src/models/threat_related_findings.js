import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class threat_related_findings extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                threat_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "threats",
                        key: "id",
                    },
                },
                finding_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
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
                tableName: "threat_related_findings",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "threat_related_findings_pkey",
                        unique: true,
                        fields: [{ name: "threat_id" }, { name: "finding_id" }],
                    },
                ],
            }
        );
    }
}
