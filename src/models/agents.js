import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class agents extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                agent_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    unique: "agents_agent_id_key",
                },
                hostname: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                platform: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                architecture: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                agent_version: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                metadata: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                },
                first_seen: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                last_seen: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "active",
                },
                tenant_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "tenants",
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
                tableName: "agents",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "agents_agent_id_key",
                        unique: true,
                        fields: [{ name: "agent_id" }],
                    },
                    {
                        name: "agents_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                    {
                        name: "idx_agents_tenant_id",
                        fields: [{ name: "tenant_id" }],
                    },
                ],
            }
        );
    }
}
