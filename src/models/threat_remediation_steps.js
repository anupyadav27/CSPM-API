import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class threat_remediation_steps extends Model {
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
                step_order: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                step_description: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: "threat_remediation_steps",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "threat_remediation_steps_pkey",
                        unique: true,
                        fields: [{ name: "threat_id" }, { name: "step_order" }],
                    },
                ],
            }
        );
    }
}
