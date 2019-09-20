import * as browserCookie from 'browser-cookies';

const IPHONES_CART = 'iphones-cart';
const AIRPODS_CART = 'airpods-cart';

type Type = 'airpod' | 'iphone';
export class ClientCookie {
    public static getCartIds(type: Type): string[] {
        const key = type === 'airpod' ? AIRPODS_CART : IPHONES_CART;
        return JSON.parse(browserCookie.get(key) || '[]');
    }

    public static addIdInCart(type: Type, id: string): void {
        const key = type === 'airpod' ? AIRPODS_CART : IPHONES_CART;
        const ids = JSON.parse(browserCookie.get(key) || '[]');
        ids.push(id);
        browserCookie.set(key, JSON.stringify(ids));
    }

    public static removeIdFromCart(type: Type, id: string): void {
        const key = type === 'airpod' ? AIRPODS_CART : IPHONES_CART;
        const ids: any[] = JSON.parse(browserCookie.get(key) || '[]');

        const index = ids.findIndex((x) => x === id);
        ids.splice(index, 1);

        browserCookie.set(key, JSON.stringify(ids));
    }

    public static clearCart(): void {
        [AIRPODS_CART, IPHONES_CART].forEach((key) => {
            browserCookie.erase(key);
        });
    }

    public static setCookieAccept(): void {
        browserCookie.set('cookie_accept', 'true');
    }

    public static isCookieAccept(): boolean {
        return browserCookie.get('cookie_accept') === 'true';
    }
}
