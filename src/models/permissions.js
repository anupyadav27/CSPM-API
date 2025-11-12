import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class permissions extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                key: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                feature: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                action: {
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
                    defaultValue: Sequelize.Sequelize.fn("now"),
                },
                updated_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn("now"),
                },
            },
            {
                sequelize,
                tableName: "permissions",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "idx_permissions_feature_action",
                        unique: true,
                        fields: [{ name: "feature" }, { name: "action" }],
                    },
                    {
                        name: "permissions_pkey",
                        unique: true,
                        fields: [{ name: "key" }],
                    },
                ],
            }
        );
    }
}
