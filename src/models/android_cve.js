import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class android_cve extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                cve_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                advisory_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: "android_advisory",
                        key: "advisory_id",
                    },
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                severity: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                type: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                reference: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                updated_aosp_versions: {
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
                tableName: "android_cve",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "android_cve_pkey",
                        unique: true,
                        fields: [{ name: "cve_id" }],
                    },
                ],
            }
        );
    }
}
