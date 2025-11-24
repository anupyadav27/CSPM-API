import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class ios_cve extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                cve_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "cves",
                        key: "cve_id",
                    },
                },
                description: {
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
                tableName: "ios_cve",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "ios_cve_pkey",
                        unique: true,
                        fields: [{ name: "cve_id" }],
                    },
                ],
            }
        );
    }
}
