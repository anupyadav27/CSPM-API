import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class windows_product extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                product_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                product_name: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "windows_product",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "windows_product_pkey",
                        unique: true,
                        fields: [{ name: "product_id" }],
                    },
                ],
            }
        );
    }
}
