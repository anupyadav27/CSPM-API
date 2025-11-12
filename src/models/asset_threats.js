import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class asset_threats extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                asset_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "assets",
                        key: "id",
                    },
                },
                threat_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "threats",
                        key: "id",
                    },
                },
            },
            {
                sequelize,
                tableName: "asset_threats",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "asset_threats_pkey",
                        unique: true,
                        fields: [{ name: "asset_id" }, { name: "threat_id" }],
                    },
                ],
            }
        );
    }
}
