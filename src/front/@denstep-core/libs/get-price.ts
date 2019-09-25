import * as currencyFormatter from 'currency-formatter';

export function getPriceWithDiscount(price: number, discount: number): number {
    return price * ((100 - discount) / 100);
};

export function getPriceWithDiscountString(price: number, discount: number): string {
    return priceToString(getPriceWithDiscount(price, discount));
};

export function priceToString(price: number): string {
    return currencyFormatter.format(price, {code: 'RUB'});
}
