import { Op } from "sequelize";

export const serviceHelpers = (ASSOCIATION_MAP) => {
    const parseNestedField = (field) => {
        const cleaned = field.replace(/_search$/, "");
        const parts = cleaned.split("__");
        const fieldName = parts.pop();
        return {
            associationPath: parts,
            fieldName,
            isSearch: field.endsWith("_search"),
        };
    };
    const resolveAssociationChain = (associationPath) => {
        const chain = [];

        for (const assoc of associationPath) {
            const info = ASSOCIATION_MAP[assoc];
            if (!info) return null;
            chain.push({ model: info.model, as: info.as });
        }

        return chain;
    };

    const buildIncludes = (keys) => {
        const includes = new Set();
        for (const key of keys) {
            const assoc = key.split("__")[0];
            if (ASSOCIATION_MAP[assoc] && !includes.has(ASSOCIATION_MAP[assoc])) {
                includes.add(ASSOCIATION_MAP[assoc]);
            }
        }
        return Array.from(includes);
    };

    const buildOrderClause = (sort = {}) => {
        const order = [];

        for (const [field, dir] of Object.entries(sort)) {
            const direction = ["ASC", 1].includes(dir) ? "ASC" : "DESC";
            const { associationPath, fieldName } = parseNestedField(field);

            if (associationPath.length === 0) {
                order.push([fieldName, direction]);
                continue;
            }

            const chain = resolveAssociationChain(associationPath);
            if (!chain) {
                console.warn(`Unknown association: ${field}`);
                continue;
            }

            order.push([...chain, fieldName, direction]);
        }

        return order;
    };

    const buildFilters = (filters = {}, searchFields = {}) => {
        const where = {};
        const andConditions = [];
        const joinKeys = new Set();

        const handleEntry = (key, value) => {
            const { associationPath, fieldName, isSearch } = parseNestedField(key);

            console.log("Parsed:", { associationPath, fieldName });

            if (associationPath.length === 0) {
                andConditions.push({
                    [fieldName]: isSearch ? { [Op.iLike]: `%${value.trim()}%` } : value,
                });
                return;
            }

            const sequelizeField = `$${associationPath.join(".")}.${fieldName}$`;
            const topAssoc = associationPath[0];

            joinKeys.add(topAssoc);

            andConditions.push({
                [sequelizeField]: isSearch ? { [Op.iLike]: `%${value.trim()}%` } : value,
            });
        };

        for (const [key, value] of Object.entries(filters)) {
            handleEntry(key, value);
        }

        for (const [key, value] of Object.entries(searchFields)) {
            if (!value?.trim()) continue;
            handleEntry(key, value);
        }

        if (andConditions.length > 0) {
            where[Op.and] = andConditions;
        }

        return { where, joinKeys };
    };

    return {
        parseNestedField,
        resolveAssociationChain,
        buildIncludes,
        buildOrderClause,
        buildFilters,
    };
};
