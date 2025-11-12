import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class ios_cve extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                cve_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "ios_cve",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "ios_cve_pkey",
                        unique: true,
                        fields: [{ name: "cve_id" }],
                    },
                ],
            }
        );
    }
}
