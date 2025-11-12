import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class connector_health_issues extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                connector_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    references: {
                        model: "cloud_connectors",
                        key: "id",
                    },
                },
                issue_description: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: "connector_health_issues",
                schema: "cspm",
                timestamps: false,
                underscored: true,
            }
        );
    }
}
