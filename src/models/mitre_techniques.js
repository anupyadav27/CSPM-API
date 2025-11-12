import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class mitre_techniques extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                technique_id: {
                    type: DataTypes.STRING(10),
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
            },
            {
                sequelize,
                tableName: "mitre_techniques",
                schema: "cspm",
                timestamps: false,
                underscored: true,
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
