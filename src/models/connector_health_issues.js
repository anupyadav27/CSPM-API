import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class connector_health_issues extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                connector_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "cloud_connectors",
                        key: "id",
                    },
                },
                issue_description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                severity: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "medium",
                },
                resolved: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                resolved_at: {
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
                tableName: "connector_health_issues",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "connector_health_issues_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
