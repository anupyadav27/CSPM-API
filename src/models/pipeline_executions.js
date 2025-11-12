import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class pipeline_executions extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                run_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    defaultValue: Sequelize.Sequelize.fn("cspm.uuid_generate_v4"),
                    primaryKey: true,
                },
                pipeline_type: {
                    type: DataTypes.STRING(50),
                    allowNull: false,
                },
                execution_status: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                    defaultValue: "running",
                },
                started_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                completed_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                triggered_by: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                environment: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                source_filters: {
                    type: DataTypes.ARRAY(DataTypes.TEXT),
                    allowNull: true,
                },
                total_sources: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                completed_sources: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                failed_sources: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                total_vulnerabilities_processed: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                data_quality_score: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                validation_errors: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                duplicate_count: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                execution_time_seconds: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                memory_usage_mb: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                cpu_usage_percent: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                error_message: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                error_details: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                },
                retry_count: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                created_by: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                    defaultValue: "system",
                },
                configuration_snapshot: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "pipeline_executions",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "idx_pipeline_executions_started_at",
                        fields: [{ name: "started_at" }],
                    },
                    {
                        name: "idx_pipeline_executions_status",
                        fields: [{ name: "execution_status" }],
                    },
                    {
                        name: "pipeline_executions_pkey",
                        unique: true,
                        fields: [{ name: "run_id" }],
                    },
                ],
            }
        );
    }
}
