import * as browserCookie from 'browser-cookies';

const CART = 'shop-cart';
const COOKIE_ACCEPTED = 'cookie_accepted';

export class ClientCookie {
    public static getGoodItemIds(): string[] {
        return JSON.parse(browserCookie.get(CART) || '[]');
    }

    public static addGoodItemId(id: string): void {
        const ids = JSON.parse(browserCookie.get(CART) || '[]');
        ids.push(id);
        browserCookie.set(CART, JSON.stringify(ids));
    }

    public static removeGoodItemId(id: string): void {
        const ids: string[] = JSON.parse(browserCookie.get(CART) || '[]');
        const index = ids.findIndex((x) => x === id);
        ids.splice(index, 1);

        browserCookie.set(CART, JSON.stringify(ids));
    }

    public static clearCart(): void {
        browserCookie.erase(CART);
    }

    public static setCookieAccepted(): void {
        browserCookie.set(COOKIE_ACCEPTED, 'true', {expires: 365});
    }

    public static isCookieAccepted(): boolean {
        return browserCookie.get(COOKIE_ACCEPTED) === 'true';
    }
}
