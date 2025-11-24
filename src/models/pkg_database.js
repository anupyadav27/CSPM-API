import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class pkg_database extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                pkg_name: {
                    type: DataTypes.STRING(200),
                    allowNull: false,
                },
                vendor: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                version: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                architecture: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                source: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                status: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                    defaultValue: "active",
                },
                release: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                dependencies: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                homepage: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                repository: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                cve_list: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                fixed_version: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                tenant_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
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
                tableName: "pkg_database",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "idx_pkg_database_tenant_id",
                        fields: [{ name: "tenant_id" }],
                    },
                    {
                        name: "pkg_database_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
