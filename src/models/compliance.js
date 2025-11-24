import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class compliance extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                tenant_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    references: {
                        model: "tenants",
                        key: "id",
                    },
                },
                framework: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                control_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                control_title: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "pending",
                },
                severity: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                last_checked_at: {
                    type: DataTypes.DATE,
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
                tableName: "compliance",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "compliance_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                    {
                        name: "idx_compliance_severity",
                        fields: [{ name: "severity" }],
                    },
                    {
                        name: "idx_compliance_status",
                        fields: [{ name: "status" }],
                    },
                    {
                        name: "idx_compliance_tenant_framework_control",
                        unique: true,
                        fields: [{ name: "tenant_id" }, { name: "framework" }, { name: "control_id" }],
                    },
                    {
                        name: "idx_compliance_tenant_id",
                        fields: [{ name: "tenant_id" }],
                    },
                ],
            }
        );
    }
}
