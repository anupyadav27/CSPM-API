import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class system_settings extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                key: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    unique: "system_settings_key_key",
                },
                value: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                tenant_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "tenants",
                        key: "id",
                    },
                },
                updated_by: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "users",
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
                tableName: "system_settings",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "idx_system_settings_tenant_scope",
                        fields: [{ name: "tenant_id" }, { name: "key" }],
                    },
                    {
                        name: "system_settings_key_key",
                        unique: true,
                        fields: [{ name: "key" }],
                    },
                    {
                        name: "system_settings_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
