import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class role_permissions extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                role_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "roles",
                        key: "id",
                    },
                },
                permission_key: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "permissions",
                        key: "key",
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
                tableName: "role_permissions",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "role_permissions_pkey",
                        unique: true,
                        fields: [{ name: "role_id" }, { name: "permission_key" }],
                    },
                ],
            }
        );
    }
}
