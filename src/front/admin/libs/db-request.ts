import axios from 'axios';

import {ShopItem} from 'admin/models/shop-item';
import {GoodPattern} from 'admin/models/good-pattern';
import {Order} from 'admin/models/order';
import {nullReplace} from 'admin/libs/null-replacer';

interface DefaultParams {
    limit: number;
    offset: number;
}

function getRequest<T>(url: string): Promise<T> {
    return axios
        .get(url)
        .then((response) => response.data);
}

function postRequest<T>(url: string, data: any): Promise<T> {
    return axios
        .post(url, data)
        .then((response) => response.data);
}

function deleteRequest<T>(url: string, data: any): Promise<T> {
    return axios
        .delete(url, data)
        .then((response) => response.data);
}

export function getTables(): Promise<string[]> {
    return getRequest<string[]>(`/api/v1/tables`);
}

// SHOP-ITEM
export function getShopItems(params: DefaultParams): Promise<ShopItem[]> {
    const {limit, offset} = params;
    return getRequest<ShopItem[]>(`/api/v1/shop-item?limit=${limit}&offset=${offset}`)
        .then((data) => nullReplace(data));
}

export function deleteShopItem(id: string): Promise<ShopItem> {
    return deleteRequest<ShopItem[]>(`/api/v1/shop-item/${id}`, {})
        .then((data) => nullReplace(data)[0]);
}

export function updateShopItem(id: string, data: ShopItem): Promise<ShopItem> {
    return postRequest<ShopItem[]>(`/api/v1/shop-item/update/${id}`, data)
        .then((data) => nullReplace(data)[0]);
}

export function insertShopItem(data: ShopItem): Promise<ShopItem> {
    return postRequest<ShopItem[]>(`/api/v1/shop-item/create`, data)
        .then((data) => nullReplace(data)[0]);
}

// GOOD-PATTERN
export function getGoodPatterns(params: DefaultParams): Promise<GoodPattern[]> {
    const {limit, offset} = params;
    return getRequest<GoodPattern[]>(`/api/v1/good-pattern?limit=${limit}&offset=${offset}`)
        .then((data) => nullReplace(data));
}

export function deleteGoodPattern(id: string): Promise<GoodPattern> {
    return deleteRequest<GoodPattern[]>(`/api/v1/good-pattern/${id}`, {})
        .then((data) => nullReplace(data)[0]);
}

export function updateGoodPattern(id: string, data: GoodPattern): Promise<GoodPattern> {
    return postRequest<GoodPattern[]>(`/api/v1/good-pattern/update/${id}`, data)
        .then((data) => nullReplace(data)[0]);
}

export function insertGoodPattern(data: GoodPattern): Promise<GoodPattern> {
    return postRequest<GoodPattern[]>(`/api/v1/good-pattern/create`, data)
        .then((data) => nullReplace(data)[0]);
}

// ORDER
export function getOrders(params: DefaultParams): Promise<Order[]> {
    const {limit, offset} = params;
    return getRequest<Order[]>(`/api/v1/order?limit=${limit}&offset=${offset}`)
        .then((data) => nullReplace(data));
}

export function updateOrder(id: string, data: Order): Promise<Order> {
    return postRequest<Order[]>(`/api/v1/order/update/${id}`, data)
        .then((data) => nullReplace(data)[0]);
}
