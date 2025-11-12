import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class source_fetch_audit extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                source_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: "vulnerability_sources",
                        key: "id",
                    },
                },
                pipeline_run_id: {
                    type: DataTypes.UUID,
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
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                validation_errors: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
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
                error_details: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                },
                retry_attempts: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                source_response_metadata: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                },
                last_modified_header: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                etag_value: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                incremental_marker: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                incremental_timestamp: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                full_sync_required: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
            },
            {
                sequelize,
                tableName: "source_fetch_audit",
                schema: "cspm",
                hasTrigger: true,
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "idx_fetch_audit_fetch_started",
                        fields: [{ name: "fetch_started" }],
                    },
                    {
                        name: "idx_fetch_audit_source_id",
                        fields: [{ name: "source_id" }],
                    },
                    {
                        name: "idx_fetch_audit_status",
                        fields: [{ name: "status" }],
                    },
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
