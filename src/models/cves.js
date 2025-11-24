import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class cves extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                cve_id: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                    primaryKey: true,
                },
                source_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "vulnerability_sources",
                        key: "id",
                    },
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                severity: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                cvss_v2_score: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                cvss_v3_score: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                cvss_v2_vector: {
                    type: DataTypes.STRING(512),
                    allowNull: true,
                },
                cvss_v3_vector: {
                    type: DataTypes.STRING(512),
                    allowNull: true,
                },
                cvss_v4_score: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                cvss_v4_vector: {
                    type: DataTypes.STRING(512),
                    allowNull: true,
                },
                published_date: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                modified_date: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                discovered_by_source: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                source_priority: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                cross_source_verified: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                },
                mitigation: {
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
                tableName: "cves",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "cves_pkey",
                        unique: true,
                        fields: [{ name: "cve_id" }],
                    },
                ],
            }
        );
    }
}
