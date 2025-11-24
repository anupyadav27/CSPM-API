import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class windows_cve_product extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                cve_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "windows_cve",
                        key: "cve_id",
                    },
                },
                product_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "windows_product",
                        key: "product_id",
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
                tableName: "windows_cve_product",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "windows_cve_product_pkey",
                        unique: true,
                        fields: [{ name: "cve_id" }, { name: "product_id" }],
                    },
                ],
            }
        );
    }
}
