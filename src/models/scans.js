import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class scans extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                agent_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    references: {
                        model: "agents",
                        key: "agent_id",
                    },
                },
                scan_start: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                scan_end: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "pending",
                },
                packages_scanned: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                vulnerabilities_found: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                scan_duration: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                analysis_mode: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "full",
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
                tableName: "scans",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "idx_scans_agent_id",
                        fields: [{ name: "agent_id" }],
                    },
                    {
                        name: "idx_scans_tenant_id",
                        fields: [{ name: "tenant_id" }],
                    },
                    {
                        name: "scans_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
