import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class vsa_database extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                advisory_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    unique: "vsa_database_advisory_id_key",
                },
                advisory_title: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                advisory_url: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                cve_list: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                affected_products: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                severity: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                cvss_score: {
                    type: DataTypes.DECIMAL,
                    allowNull: true,
                },
                published_date: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                updated_date: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                title: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                published_date_advisory: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                severity_advisory: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                affected_packages: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                cve_list_advisory: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                references_advisory: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                status_advisory: {
                    type: DataTypes.TEXT,
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
                advisory_updated_date: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "vsa_database",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "vsa_database_advisory_id_key",
                        unique: true,
                        fields: [{ name: "advisory_id" }],
                    },
                    {
                        name: "vsa_database_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
