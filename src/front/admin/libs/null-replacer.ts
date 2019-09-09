export function nullReplace<T>(items: T[]): T[] {
    return items.map((data) => Object.entries(data).reduce((res, [key, value]) => {
        res[key] = value === null ? undefined : value;
        return res;
    }, {} as any));
}
