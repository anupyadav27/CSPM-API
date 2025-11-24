import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class roles extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                tenant_scoped: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
                },
                created_by: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "users",
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
                tableName: "roles",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "roles_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
