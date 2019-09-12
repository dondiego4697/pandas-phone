export function makeLookup(data: string[]): Record<string, string> {
    return data.reduce(
        (res: Record<string, string>, curr) => {
            res[curr] = curr;
            return res;
        },
        {}
    );
}
