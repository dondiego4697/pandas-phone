import axios from 'axios';

import {IIphone} from 'admin/models/iphone';
import {IAirpods} from 'admin/models/airpods';
import {IOrder} from 'admin/models/orders';
import {IOrderItem} from 'admin/models/order';

interface IDefaultParams {
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

// IPHONE
export function getIphones(params: IDefaultParams): Promise<IIphone[]> {
    const {limit, offset} = params;
    return getRequest<IIphone[]>(`/api/v1/iphone?limit=${limit}&offset=${offset}`);
}

interface IIphoneEnums {
    models: string[];
    colors: string[];
    memories: string[];
}

export function getIphoneEnums(): Promise<IIphoneEnums> {
    return getRequest<IIphoneEnums>(`/api/v1/iphone/enums`);
}

export function deleteIphone(id: string): Promise<IIphone> {
    return deleteRequest<IIphone[]>(`/api/v1/iphone/${id}`, {}).then((data) => data[0]);
}

export function updateIphone(id: string, data: IIphone): Promise<IIphone> {
    return postRequest<IIphone[]>(`/api/v1/iphone/update/${id}`, data).then((data) => data[0]);
}

export function insertIphone(data: IIphone): Promise<IIphone> {
    return postRequest<IIphone[]>(`/api/v1/iphone/create`, data).then((data) => data[0]);
}

// AIRPODS
export function getAirpods(params: IDefaultParams): Promise<IAirpods[]> {
    const {limit, offset} = params;
    return getRequest<IAirpods[]>(`/api/v1/airpods?limit=${limit}&offset=${offset}`);
}

interface IAirpodsEnums {
    series: string[];
}

export function getAirpodsEnums(): Promise<IAirpodsEnums> {
    return getRequest<IAirpodsEnums>(`/api/v1/airpods/enums`);
}

export function deleteAirpods(id: string): Promise<IAirpods> {
    return deleteRequest<IAirpods[]>(`/api/v1/airpods/${id}`, {}).then((data) => data[0]);
}

export function updateAirpods(id: string, data: IAirpods): Promise<IAirpods> {
    return postRequest<IAirpods[]>(`/api/v1/airpods/update/${id}`, data).then((data) => data[0]);
}

export function insertAirpods(data: IAirpods): Promise<IAirpods> {
    return postRequest<IAirpods[]>(`/api/v1/airpods/create`, data).then((data) => data[0]);
}

// ORDER
export function getOpendOrders(params: IDefaultParams): Promise<IOrder[]> {
    const {limit, offset} = params;
    return getRequest<IOrder[]>(`/api/v1/order/opened?limit=${limit}&offset=${offset}`);
}

export function getOrder(id: string): Promise<IOrder> {
    return getRequest<IOrder[]>(`/api/v1/order/id/${id}`).then((data) => data[0]);
}

export interface IOrderEnums {
    statuses: string[];
    good_types: string[];
}

export function getOrderEnums(): Promise<IOrderEnums> {
    return getRequest<IOrderEnums>(`/api/v1/order/enums`);
}

export function updateOrder(id: string, data: IOrder): Promise<IOrder> {
    return postRequest<IOrder[]>(`/api/v1/order/update/${id}`, data).then((data) => data[0]);
}

export function getOrderItems(orderId: string): Promise<IOrderItem[]> {
    return getRequest<IOrderItem[]>(`/api/v1/order/${orderId}/items`);
}

export function insertOrderItem(data: IOrderItem): Promise<IOrderItem> {
    return postRequest<IOrderItem[]>(`/api/v1/order/item/create`, data).then((data) => data[0]);
}

export function deleteOrderItem(id: string): Promise<IOrderItem> {
    return deleteRequest<IOrderItem[]>(`/api/v1/order/item/${id}`, {}).then((data) => data[0]);
}

export function updateOrderItem(id: string, data: IOrderItem): Promise<IOrderItem> {
    return postRequest<IOrderItem[]>(`/api/v1/order/item/update/${id}`, data).then((data) => data[0]);
}

export function changeOrderStatus(id: string, status: 'reject' | 'bought' | 'called'): Promise<IOrder> {
    return postRequest<IOrder[]>(`/api/v1/order/${id}/update/status`, {status}).then((data) => data[0]);
}
