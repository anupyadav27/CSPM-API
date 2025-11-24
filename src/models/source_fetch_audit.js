import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class source_fetch_audit extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
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
                pipeline_run_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "pipeline_executions",
                        key: "run_id",
                    },
                },
                fetch_started: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                fetch_completed: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                records_available: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                records_fetched: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                records_new: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                records_updated: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                records_duplicated: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                records_skipped: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                fetch_quality_score: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                parsing_errors: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                validation_errors: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                fetch_duration_seconds: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                parse_duration_seconds: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                load_duration_seconds: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                api_calls_made: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                data_transferred_mb: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                rate_limit_hits: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                error_message: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                retry_attempts: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
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
                tableName: "source_fetch_audit",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "source_fetch_audit_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
