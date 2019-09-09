interface Pagination {
    limit: number;
    offset: number;
}

export function seizePaginationParams(data: Record<string, any>): Pagination {
    const result = {
        limit: data.limit || 10,
        offset: data.offset || 0
    };

    delete data.limit;
    delete data.offset;

    return result;
}

interface GetWhere {
    pairsText: string[];
    values: any[];
}

export function makeWhere(data: Record<string, any>): GetWhere {
    return Object.entries(data).reduce((res, [key, value], i) => {
        res.pairsText.push(`${key}=$${i + 1}`);
        res.values.push(value);
        return res;
    }, {pairsText: [], values: []} as GetWhere);
}

interface Insert {
    names: string[];
    values: any[];
}

export function makeInsert(data: Record<string, any>): Insert {
    return Object.entries(data).reduce((res, [key, value], i) => {
        res.names.push(key);
        res.values.push(value);
        return res;
    }, {names: [], values: []} as Insert);
}
