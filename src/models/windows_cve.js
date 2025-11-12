import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class windows_cve extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                cve_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                cve_title: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                cve_description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                severity: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                cvss_score: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                cvss_vector: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                remediation: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                threat_info: {
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
                tableName: "windows_cve",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "windows_cve_pkey",
                        unique: true,
                        fields: [{ name: "cve_id" }],
                    },
                ],
            }
        );
    }
}
