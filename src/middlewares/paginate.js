const paginate = (defaultPageSize = 10, maxPageSize = 100) => {
    return (req, res, next) => {
        let { page, pageSize } = req.query;
        if (pageSize !== undefined || page !== undefined) {
            page = page ? Math.max(parseInt(page), 1) : 1;
            pageSize = pageSize ? Math.min(Math.max(parseInt(pageSize), 1), maxPageSize) : defaultPageSize;

            req.pagination = {
                enabled: true,
                page,
                pageSize,
                skip: (page - 1) * pageSize,
            };
        } else {
            req.pagination = {
                enabled: false,
            };
        }

        next();
    };
};

export default paginate;
