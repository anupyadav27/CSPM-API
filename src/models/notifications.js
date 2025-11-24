import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class notifications extends Model {
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
                    allowNull: true,
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
                title: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                body: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                category: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "alert",
                },
                severity_score: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                channels: {
                    type: DataTypes.ARRAY(DataTypes.TEXT),
                    allowNull: true,
                },
                read: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
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
                tableName: "notifications",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "idx_notifications_tenant_id",
                        fields: [{ name: "tenant_id" }],
                    },
                    {
                        name: "notifications_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
