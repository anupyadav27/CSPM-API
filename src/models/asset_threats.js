import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

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
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                updated_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
                },
            },
            {
                sequelize,
                tableName: "asset_threats",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
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
