import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class cve_attack_mappings extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                cve_id: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                    references: {
                        model: "cves",
                        key: "cve_id",
                    },
                    unique: "cve_attack_mappings_cve_id_technique_id_key",
                },
                technique_id: {
                    type: DataTypes.STRING(10),
                    allowNull: true,
                    references: {
                        model: "mitre_techniques",
                        key: "technique_id",
                    },
                    unique: "cve_attack_mappings_cve_id_technique_id_key",
                },
                confidence_level: {
                    type: DataTypes.STRING(10),
                    allowNull: true,
                    defaultValue: "medium",
                },
                mapping_source: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                created_at: {
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
                indexes: [
                    {
                        name: "cve_attack_mappings_cve_id_technique_id_key",
                        unique: true,
                        fields: [{ name: "cve_id" }, { name: "technique_id" }],
                    },
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
