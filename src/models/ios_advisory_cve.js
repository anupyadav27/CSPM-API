import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class ios_advisory_cve extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                advisory_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "ios_advisory",
                        key: "advisory_id",
                    },
                },
                cve_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "ios_cve",
                        key: "cve_id",
                    },
                },
            },
            {
                sequelize,
                tableName: "ios_advisory_cve",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "ios_advisory_cve_pkey",
                        unique: true,
                        fields: [{ name: "advisory_id" }, { name: "cve_id" }],
                    },
                ],
            }
        );
    }
}
