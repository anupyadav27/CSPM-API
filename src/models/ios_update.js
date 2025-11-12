import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class ios_update extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                update_id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
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
                    unique: "ios_update_update_url_key",
                },
            },
            {
                sequelize,
                tableName: "ios_update",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "ios_update_pkey",
                        unique: true,
                        fields: [{ name: "update_id" }],
                    },
                    {
                        name: "ios_update_update_url_key",
                        unique: true,
                        fields: [{ name: "update_url" }],
                    },
                ],
            }
        );
    }
}
