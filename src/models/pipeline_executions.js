import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class pipeline_executions extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                run_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                pipeline_type: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                execution_status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "pending",
                },
                started_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                completed_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                triggered_by: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                environment: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                source_filters: {
                    type: DataTypes.TEXT,
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
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                duplicate_count: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                execution_time_seconds: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                memory_usage_mb: {
                    type: DataTypes.INTEGER,
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
                retry_count: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                created_by: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "users",
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
                tableName: "pipeline_executions",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
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
