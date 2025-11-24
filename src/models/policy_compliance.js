import _sequelize from "sequelize";

const { Model, Sequelize } = _sequelize;

export default class policy_compliance extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                policy_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "policies",
                        key: "id",
                    },
                },
                compliance_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: "compliance",
                        key: "id",
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
                tableName: "policy_compliance",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                freezeTableName: true,
                indexes: [
                    {
                        name: "policy_compliance_pkey",
                        unique: true,
                        fields: [{ name: "policy_id" }, { name: "compliance_id" }],
                    },
                ],
            }
        );
    }
}
