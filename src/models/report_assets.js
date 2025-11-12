import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class report_assets extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                report_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "reports",
                        key: "id",
                    },
                },
                asset_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "assets",
                        key: "id",
                    },
                },
            },
            {
                sequelize,
                tableName: "report_assets",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "report_assets_pkey",
                        unique: true,
                        fields: [{ name: "report_id" }, { name: "asset_id" }],
                    },
                ],
            }
        );
    }
}
