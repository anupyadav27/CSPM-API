import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class policy_assets extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                policy_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "policies",
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
                tableName: "policy_assets",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "policy_assets_pkey",
                        unique: true,
                        fields: [{ name: "policy_id" }, { name: "asset_id" }],
                    },
                ],
            }
        );
    }
}
