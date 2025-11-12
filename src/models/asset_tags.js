import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class asset_tags extends Model {
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
                tag_key: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                tag_value: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: "asset_tags",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "asset_tags_pkey",
                        unique: true,
                        fields: [{ name: "asset_id" }, { name: "tag_key" }],
                    },
                ],
            }
        );
    }
}
