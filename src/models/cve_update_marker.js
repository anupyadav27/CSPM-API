import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class cve_update_marker extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                source_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "vulnerability_sources",
                        key: "id",
                    },
                },
                latest_cve_id: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                },
                updated_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                tenant_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "tenants",
                        key: "id",
                    },
                },
            },
            {
                sequelize,
                tableName: "cve_update_marker",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "cve_update_marker_pkey",
                        unique: true,
                        fields: [{ name: "source_id" }],
                    },
                    {
                        name: "idx_cve_update_marker_tenant_id",
                        fields: [{ name: "tenant_id" }],
                    },
                ],
            }
        );
    }
}
