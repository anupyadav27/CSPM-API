import _sequelize from "sequelize";

const { Model } = _sequelize;

export default class report_policies extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                report_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "reports",
                        key: "id",
                    },
                },
                policy_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "policies",
                        key: "id",
                    },
                },
            },
            {
                sequelize,
                tableName: "report_policies",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "report_policies_pkey",
                        unique: true,
                        fields: [{ name: "report_id" }, { name: "policy_id" }],
                    },
                ],
            }
        );
    }
}
