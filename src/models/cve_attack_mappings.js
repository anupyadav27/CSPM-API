import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class cve_attack_mappings extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                cve_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "cves",
                        key: "cve_id",
                    },
                },
                technique_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "mitre_techniques",
                        key: "technique_id",
                    },
                },
                confidence_level: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: "medium",
                },
                mapping_source: {
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
            },
            {
                sequelize,
                tableName: "cve_attack_mappings",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "cve_attack_mappings_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
