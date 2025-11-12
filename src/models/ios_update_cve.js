import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class ios_update_cve extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                update_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "ios_update",
                        key: "update_id",
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
                tableName: "ios_update_cve",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "ios_update_cve_pkey",
                        unique: true,
                        fields: [{ name: "update_id" }, { name: "cve_id" }],
                    },
                ],
            }
        );
    }
}
