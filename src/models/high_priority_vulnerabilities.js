import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class high_priority_vulnerabilities extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                cve_id: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                severity: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                cvss_v3_score: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                published_date: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                business_criticality: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                source_name: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                source_display_name: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                source_priority: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                requires_immediate_attention: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "high_priority_vulnerabilities",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
            }
        );
    }
}
