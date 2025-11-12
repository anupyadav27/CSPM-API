import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class scan_vulnerabilities extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                scan_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "scans",
                        key: "id",
                    },
                },
                cve_id: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                },
                package_name: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                package_version: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                severity: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                score: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                vector: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                discovered_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                source: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                    defaultValue: "engine",
                },
                agent_id: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                system_info: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                },
                tenant_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    references: {
                        model: "tenants",
                        key: "id",
                    },
                },
            },
            {
                sequelize,
                tableName: "scan_vulnerabilities",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "idx_scan_vulns_tenant_id",
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
