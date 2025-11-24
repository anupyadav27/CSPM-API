export const queryHelpers = (JOIN_SCHEMA) => {
    const getAlias = (key) => {
        const def = JOIN_SCHEMA[key];
        return def ? def.alias : null;
    };

    const buildDynamicJoins = (joinKeys, parentAlias = "t") => {
        let joinSQL = "";
        const selectedColumns = [];

        joinKeys.forEach((key) => {
            const joinDef = JOIN_SCHEMA[key];
            if (!joinDef) return;

            const alias = joinDef.alias;
            const table = joinDef.table;
            const joinType = joinDef.type || "LEFT JOIN";

            joinSQL += `\n${joinType} ${table} ${alias} ON ${joinDef.on(parentAlias)}`;

            if (Array.isArray(joinDef.columns)) {
                const namespaced = joinDef.columns.map((col) => `${alias}.${col} AS ${getTableName(joinDef.table)}__${col}`);
                selectedColumns.push(...namespaced);
            }
        });

        return {
            joinSQL,
            selectedColumns,
        };
    };

    const getTableName = (fullTableName) => {
        return fullTableName.split(".").pop();
    };

    const buildSelectClause = (joinColumns = [], parentAlias = "t", extraSelect = []) => {
        const baseColumns = [`${parentAlias}.*`];
        const mergedColumns = [...baseColumns, ...joinColumns, ...extraSelect];
        return `SELECT ${mergedColumns.join(", ")}`;
    };

    const buildWhereClause = (filters = {}, searchFields = {}, parentAlias = "t") => {
        const whereParts = [];
        const params = [];
        const joinKeys = new Set();

        const processCondition = (rawKey, value, isSearch = false) => {
            const keyParts = rawKey.split(".");
            let column;

            if (keyParts.length === 1) {
                column = `${parentAlias}.${rawKey}`;
            } else {
                const mainKey = keyParts[0];
                const field = keyParts.slice(1).join(".");
                const alias = getAlias(mainKey);
                if (!alias) {
                    throw new Error(`Unknown join key in filter: ${mainKey}`);
                }
                joinKeys.add(mainKey);
                column = `${alias}.${field}`;
            }

            if (isSearch) {
                whereParts.push(`${column} ILIKE ?`);
                params.push(`%${value}%`);
            } else if (Array.isArray(value)) {
                const placeholders = value.map(() => "?");
                whereParts.push(`${column} IN (${placeholders.join(", ")})`);
                params.push(...value);
            } else if (value && typeof value === "object") {
                if (value.gt !== undefined) {
                    whereParts.push(`${column} > ?`);
                    params.push(value.gt);
                }
                if (value.gte !== undefined) {
                    whereParts.push(`${column} >= ?`);
                    params.push(value.gte);
                }
                if (value.lt !== undefined) {
                    whereParts.push(`${column} < ?`);
                    params.push(value.lt);
                }
                if (value.lte !== undefined) {
                    whereParts.push(`${column} <= ?`);
                    params.push(value.lte);
                }
            } else {
                whereParts.push(`${column} = ?`);
                params.push(value);
            }
        };

        for (const [key, value] of Object.entries(filters)) {
            if (value === null) continue;
            processCondition(key, value, false);
        }

        for (const [key, search] of Object.entries(searchFields)) {
            if (!search) continue;
            processCondition(key, String(search).trim(), true);
        }

        const whereSQL = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";
        return { whereSQL, params, joinKeys };
    };

    const buildSortClause = (sort = {}, parentAlias = "t") => {
        const orderParts = [];
        const joinKeys = new Set();

        for (const [rawKey, dir] of Object.entries(sort)) {
            if (dir === null) continue;

            const keyParts = rawKey.split(".");
            let column;

            if (keyParts.length === 1) {
                column = `${parentAlias}.${rawKey}`;
            } else {
                const mainKey = keyParts[0];
                const field = keyParts.slice(1).join(".");
                const alias = getAlias(mainKey);
                if (!alias) {
                    throw new Error(`Unknown join key in sort: ${mainKey}`);
                }
                joinKeys.add(mainKey);
                column = `${alias}.${field}`;
            }

            const direction = String(dir).toUpperCase() === "DESC" ? "DESC" : "ASC";
            orderParts.push(`${column} ${direction}`);
        }

        const orderSQL = orderParts.length ? `ORDER BY ${orderParts.join(", ")}` : "";
        return { orderSQL, joinKeys };
    };

    return {
        buildDynamicJoins,
        buildSelectClause,
        buildWhereClause,
        buildSortClause,
    };
};
