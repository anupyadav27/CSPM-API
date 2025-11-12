import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class quality_metrics extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                pipeline_run_id: {
                    type: DataTypes.UUID,
                    allowNull: true,
                    references: {
                        model: "pipeline_executions",
                        key: "run_id",
                    },
                },
                source_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: "vulnerability_sources",
                        key: "id",
                    },
                },
                completeness_score: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                accuracy_score: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                consistency_score: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                timeliness_score: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                validity_score: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                total_records: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                valid_records: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                duplicate_records: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                invalid_records: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                missing_critical_fields: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                schema_violations: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                },
                business_rule_violations: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                },
                data_anomalies: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                },
                compared_with_sources: {
                    type: DataTypes.ARRAY(DataTypes.INTEGER),
                    allowNull: true,
                },
                consistency_conflicts: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
                },
            },
            {
                sequelize,
                tableName: "quality_metrics",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "quality_metrics_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
