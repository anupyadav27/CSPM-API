import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class agents extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                agent_id: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    unique: "agents_agent_id_key",
                },
                hostname: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                platform: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                architecture: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                agent_version: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                metadata: {
                    type: DataTypes.JSONB,
                    allowNull: true,
                    defaultValue: {},
                },
                first_seen: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                last_seen: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                status: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                    defaultValue: "active",
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
                tenant_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    references: {
                        model: "tenants",
                        key: "id",
                    },
                },
            },
            {
                sequelize,
                tableName: "agents",
                schema: "cspm",
                hasTrigger: true,
                timestamps: false,
                underscored: true,
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
