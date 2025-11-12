import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class compliance_remediation_steps extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                compliance_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "compliance",
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
                tableName: "compliance_remediation_steps",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "compliance_remediation_steps_pkey",
                        unique: true,
                        fields: [{ name: "compliance_id" }, { name: "step_order" }],
                    },
                ],
            }
        );
    }
}
