import * as cleanDeep from 'clean-deep';

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

interface IGetWhereParams {
    pairs: string[];
    values: any[];
}

export function makeWhereParams(rawData: Record<string, any>): IGetWhereParams {
    const data = cleanDeep(rawData, {nullValues: false});
    let i = 0;
    return Object.entries(data).reduce((res, [key, value]) => {
        const parts = (value as string).split(',');
        if (parts.length > 1) {
            const orPairs = parts.map(() => {
                i++;
                return `${key}=$${i}`;
            });
            res.pairs.push(`(${orPairs.join(' OR ')})`);
            res.values.push(...parts);
        } else {
            i++;
            res.pairs.push(`${key}=$${i}`);
            res.values.push(value);
        }
        return res;
    }, {pairs: [], values: []} as IGetWhereParams);
}

interface IInsertParams {
    fields: string[];
    values: any[];
}

export function makeInsertParams(rawData: Record<string, any>): IInsertParams {
    const data = cleanDeep(rawData, {nullValues: false});
    return Object.entries(data).reduce((res, [key, value], i) => {
        res.fields.push(key);
        res.values.push(value);
        return res;
    }, {fields: [], values: []} as IInsertParams);
}

export function makeInsertText(tableName: string, fields: string[]): string {
    return `
        INSERT INTO ${tableName}
        (${fields.join(', ')}) VALUES (${fields.map((_, i) => `$${i + 1}`).join(', ')})
        RETURNING *;
    `;
}

export function makeUpdateText(tableName: string, fields: string[], returning = '*'): string {
    if (fields.length === 1) {
        return `
            UPDATE ${tableName}
            SET ${fields.join(', ')}=${fields.map((_, i) => `$${i + 2}`).join(', ')}
            WHERE id=$1 RETURNING ${returning};
        `;
    }

    return `
        UPDATE ${tableName}
        SET (${fields.join(', ')})=(${fields.map((_, i) => `$${i + 2}`).join(', ')})
        WHERE id=$1 RETURNING *;
    `;
}

export function makeDeleteText(tableName: string): string {
    return `DELETE FROM ${tableName} WHERE id=$1 RETURNING *;`;
}
