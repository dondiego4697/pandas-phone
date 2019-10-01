import * as numeral from 'numeral';

interface INumberOptions {
    min?: number;
    max?: number;
}

export function formatNumber(value: string, options: INumberOptions = {}): string {
    if (value === '-') {
        return value;
    }

    let newValue = numeral(value).value();
    if (newValue === null) {
        return '';
    }

    const {min, max} = options;
    if (min !== undefined) {
        newValue = Math.max(newValue, min);
    }

    if (max !== undefined) {
        newValue = Math.min(newValue, max);
    }

    return String(newValue);
}
