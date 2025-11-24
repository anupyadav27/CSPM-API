import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class source_health_summary extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                source_name: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                display_name: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                status: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                last_fetch_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                last_fetch_status: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                total_cves: {
                    type: DataTypes.BIGINT,
                    allowNull: true,
                },
                recent_cves: {
                    type: DataTypes.BIGINT,
                    allowNull: true,
                },
                avg_completeness: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                avg_accuracy: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "source_health_summary",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
            }
        );
    }
}
