import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class threats extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    primaryKey: true,
                },
                tenant_id: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    references: {
                        model: "tenants",
                        key: "id",
                    },
                },
                asset_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    references: {
                        model: "assets",
                        key: "id",
                    },
                },
                source: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                title: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                severity: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                category: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                type: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                detected_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn("now"),
                },
                last_updated_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn("now"),
                },
                resolved_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    defaultValue: "active",
                },
                confidence: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                region: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                remediation_automated: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: false,
                },
                remediation_lambda_action_id: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn("now"),
                },
                updated_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn("now"),
                },
            },
            {
                sequelize,
                tableName: "threats",
                schema: "cspm",
                timestamps: false,
                underscored: true,
                indexes: [
                    {
                        name: "idx_threats_asset_id",
                        fields: [{ name: "asset_id" }],
                    },
                    {
                        name: "idx_threats_source_detected",
                        fields: [{ name: "source" }, { name: "detected_at", order: "DESC" }],
                    },
                    {
                        name: "idx_threats_tenant_severity_status",
                        fields: [{ name: "tenant_id" }, { name: "severity" }, { name: "status" }],
                    },
                    {
                        name: "threats_pkey",
                        unique: true,
                        fields: [{ name: "id" }],
                    },
                ],
            }
        );
    }
}
