import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class ios_advisory extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                advisory_id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                advisory_url: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    unique: "ios_advisory_advisory_url_key",
                },
                advisory_title: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                advisory_date: {
                    type: DataTypes.DATEONLY,
                    allowNull: true,
                },
                product: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                summary: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "ios_advisory",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "ios_advisory_advisory_url_key",
                        unique: true,
                        fields: [{ name: "advisory_url" }],
                    },
                    {
                        name: "ios_advisory_pkey",
                        unique: true,
                        fields: [{ name: "advisory_id" }],
                    },
                ],
            }
        );
    }
}
