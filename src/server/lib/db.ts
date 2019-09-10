interface IPagination {
    limit: number;
    offset: number;
}

export function seizePaginationParams(data: Record<string, any>): IPagination {
    const result = {
        limit: data.limit || 10,
        offset: data.offset || 0
    };

    delete data.limit;
    delete data.offset;

    return result;
}

interface IGetWhere {
    pairsText: string[];
    values: any[];
}

export function makeWhere(data: Record<string, any>): IGetWhere {
    return Object.entries(data).reduce((res, [key, value], i) => {
        res.pairsText.push(`${key}=$${i + 1}`);
        res.values.push(value);
        return res;
    }, {pairsText: [], values: []} as IGetWhere);
}

interface IInsert {
    names: string[];
    values: any[];
}

export function makeInsert(data: Record<string, any>): IInsert {
    return Object.entries(data).reduce((res, [key, value], i) => {
        res.names.push(key);
        res.values.push(value);
        return res;
    }, {names: [], values: []} as IInsert);
}
