import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class scans extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                agent_id: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                scan_start: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                scan_end: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                    defaultValue: "running",
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
                    type: DataTypes.DOUBLE,
                    allowNull: true,
                },
                system_info: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                    defaultValue: {},
                },
                analysis_mode: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                    defaultValue: "central",
                },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
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
                tableName: "scans",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
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
