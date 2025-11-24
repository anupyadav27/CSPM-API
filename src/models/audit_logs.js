import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class audit_logs extends Model {
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
                user_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "users",
                        key: "id",
                    },
                },
                action: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                entity_type: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                entity_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                ip_address: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                user_agent: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                request_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                method: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                params: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                response_status: {
                    type: DataTypes.INTEGER,
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
                tableName: "audit_logs",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "audit_logs_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
