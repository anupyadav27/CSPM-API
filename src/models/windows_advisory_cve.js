import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class windows_advisory_cve extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                advisory_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "windows_advisory",
                        key: "advisory_id",
                    },
                },
                cve_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "windows_cve",
                        key: "cve_id",
                    },
                },
            },
            {
                sequelize,
                tableName: "windows_advisory_cve",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "windows_advisory_cve_pkey",
                        unique: true,
                        fields: [{ name: "advisory_id" }, { name: "cve_id" }],
                    },
                ],
            }
        );
    }
}
