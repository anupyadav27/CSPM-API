import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class scan_vulnerabilities extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                scan_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    references: {
                        model: "scans",
                        key: "id",
                    },
                },
                cve_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    references: {
                        model: "cves",
                        key: "cve_id",
                    },
                },
                package_name: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                package_version: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                severity: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                score: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                vector: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                discovered_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                source: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                agent_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "agents",
                        key: "agent_id",
                    },
                },
                tenant_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    references: {
                        model: "tenants",
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
                tableName: "scan_vulnerabilities",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "idx_scan_vulnerabilities_cve_id",
                        fields: [{ name: "cve_id" }],
                    },
                    {
                        name: "idx_scan_vulnerabilities_scan_id",
                        fields: [{ name: "scan_id" }],
                    },
                    {
                        name: "idx_scan_vulnerabilities_tenant_id",
                        fields: [{ name: "tenant_id" }],
                    },
                    {
                        name: "scan_vulnerabilities_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
