import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class pkg_database extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                pkg_name: {
                    type: DataTypes.STRING(200),
                    allowNull: false,
                    unique: "pkg_database_unique_pkg_vendor_version",
                },
                vendor: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                    unique: "pkg_database_unique_pkg_vendor_version",
                },
                version: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                    unique: "pkg_database_unique_pkg_vendor_version",
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
                    unique: "pkg_database_unique",
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
            },
            {
                sequelize,
                tableName: "pkg_database",
                schema: "cspm",
                timestamps: false,
                underscored: true,
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
                    {
                        name: "pkg_database_unique",
                        unique: true,
                        fields: [
                            { name: "pkg_name" },
                            { name: "vendor" },
                            { name: "version" },
                            { name: "release" },
                        ],
                    },
                    {
                        name: "pkg_database_unique_pkg_vendor_version",
                        unique: true,
                        fields: [{ name: "pkg_name" }, { name: "vendor" }, { name: "version" }],
                    },
                ],
            }
        );
    }
}
