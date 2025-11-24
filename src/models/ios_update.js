import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class ios_update extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                update_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                update_version: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                release_date: {
                    type: DataTypes.DATEONLY,
                    allowNull: true,
                },
                product: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                update_url: {
                    type: DataTypes.TEXT,
                    allowNull: true,
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
                tableName: "ios_update",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "ios_update_pkey",
                        unique: true,
                        fields: [{ name: "update_id" }],
                    },
                ],
            }
        );
    }
}
