import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class android_advisory extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                advisory_id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                bulletin_url: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    unique: "android_advisory_bulletin_url_key",
                },
                bulletin_title: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                bulletin_date: {
                    type: DataTypes.DATEONLY,
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
                tableName: "android_advisory",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "android_advisory_bulletin_url_key",
                        unique: true,
                        fields: [{ name: "bulletin_url" }],
                    },
                    {
                        name: "android_advisory_pkey",
                        unique: true,
                        fields: [{ name: "advisory_id" }],
                    },
                ],
            }
        );
    }
}
