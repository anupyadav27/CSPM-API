import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class asset_compliance extends Model {
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
                compliance_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "compliance",
                        key: "id",
                    },
                },
            },
            {
                sequelize,
                tableName: "asset_compliance",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "asset_compliance_pkey",
                        unique: true,
                        fields: [{ name: "asset_id" }, { name: "compliance_id" }],
                    },
                ],
            }
        );
    }
}
