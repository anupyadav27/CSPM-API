import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class compliance_remediation_steps extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                compliance_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    references: {
                        model: "compliance",
                        key: "id",
                    },
                },
                step_order: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                step_description: {
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
                tableName: "compliance_remediation_steps",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "compliance_remediation_steps_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
