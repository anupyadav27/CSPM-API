import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class windows_advisory extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                advisory_id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                advisory_tracking_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    unique: "windows_advisory_advisory_tracking_id_key",
                },
                advisory_title: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                initial_release_date: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                current_release_date: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                reference_urls: {
                    type: DataTypes.JSONB,
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
                tableName: "windows_advisory",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "windows_advisory_advisory_tracking_id_key",
                        unique: true,
                        fields: [{ name: "advisory_tracking_id" }],
                    },
                    {
                        name: "windows_advisory_pkey",
                        unique: true,
                        fields: [{ name: "advisory_id" }],
                    },
                ],
            }
        );
    }
}
