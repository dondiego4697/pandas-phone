import * as browserCookie from 'browser-cookies';

const IPHONES_CART = 'iphones-cart';
const AIRPODS_CART = 'airpods-cart';

type Type = 'airpod' | 'iphone';
export class ClientCookie {
    public static getCartIds<T>(type: Type): T[] {
        const key = type === 'airpod' ? AIRPODS_CART : IPHONES_CART;
        return JSON.parse(browserCookie.get(key) || '[]');
    }

    public static addIdInCart(type: Type, id: string): void {
        const key = type === 'airpod' ? AIRPODS_CART : IPHONES_CART;
        const ids = JSON.parse(browserCookie.get(key) || '[]');
        ids.push(id);
        browserCookie.set(key, JSON.stringify(ids));
    }

    /* public static removeItemFromCart(type: Type, item: IAirpod | IIphone): void {
        const key = type === 'airpod' ? AIRPODS_CART : IPHONES_CART;
        const items: any[] = JSON.parse(browserCookie.get(key) || '[]');

        const index = items.findIndex((x) => x.localId === item.localId);
        items.splice(index, 1);

        browserCookie.set(key, JSON.stringify(items));
    } */

    public static clearCart(): void {
        [AIRPODS_CART, IPHONES_CART].forEach((key) => {
            browserCookie.erase(key);
        });
    }
}
