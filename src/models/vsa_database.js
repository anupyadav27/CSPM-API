import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class vsa_database extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                advisory_id: {
                    type: DataTypes.STRING(50),
                    allowNull: false,
                    unique: "vsa_database_advisory_id_key",
                },
                vendor: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                title: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                published_date: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                severity: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                affected_packages: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                cve_list: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                references: {
                    type: DataTypes.TEXT,
                    allowNull: true,
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
                advisory_updated_date: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "vsa_database",
                schema: "cspm",
                hasTrigger: true,
                timestamps: false,
                underscored: true,
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
