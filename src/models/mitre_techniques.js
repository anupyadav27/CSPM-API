import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class mitre_techniques extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                technique_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                description: {
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
                tableName: "mitre_techniques",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "mitre_techniques_pkey",
                        unique: true,
                        fields: [{ name: "technique_id" }],
                    },
                ],
            }
        );
    }
}
