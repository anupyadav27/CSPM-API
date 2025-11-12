import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class reports extends Model {
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
                title: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                type: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                format: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "pdf",
                },
                generated_by: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    references: {
                        model: "users",
                        key: "id",
                    },
                },
                generated_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn("now"),
                },
                scheduled: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                schedule_cron: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                schedule_next_run_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                schedule_recipients: {
                    type: DataTypes.ARRAY(DataTypes.TEXT),
                    allowNull: true,
                },
                data_summary: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                file_url: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                export_metadata: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "pending",
                },
                error_message: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                triggered_by_automation: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                automation_ref: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn("now"),
                },
                updated_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn("now"),
                },
            },
            {
                sequelize,
                tableName: "reports",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "idx_reports_status",
                        fields: [{ name: "status" }],
                    },
                    {
                        name: "idx_reports_tenant_type_generated",
                        fields: [
                            { name: "tenant_id" },
                            { name: "type" },
                            { name: "generated_at", order: "DESC" },
                        ],
                    },
                    {
                        name: "reports_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
