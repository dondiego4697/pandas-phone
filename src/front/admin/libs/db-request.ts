import axios from 'axios';

import {IIphone} from 'admin/models/iphones';
import {IAirpod} from 'admin/models/airpods';
import {IOrder} from 'admin/models/orders';
import {IOrderItems} from 'admin/models/order';

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
    return getRequest<IIphone[]>(`/api/v1/iphones?limit=${limit}&offset=${offset}`);
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

// AIRPOD
export function getAirpods(params: IDefaultParams): Promise<IAirpod[]> {
    const {limit, offset} = params;
    return getRequest<IAirpod[]>(`/api/v1/airpods?limit=${limit}&offset=${offset}`);
}

interface IAirpodEnums {
    series: string[];
}

export function getAirpodsEnums(): Promise<IAirpodEnums> {
    return getRequest<IAirpodEnums>(`/api/v1/airpod/enums`);
}

export function deleteAirpod(id: string): Promise<IAirpod> {
    return deleteRequest<IAirpod[]>(`/api/v1/airpod/${id}`, {}).then((data) => data[0]);
}

export function updateAirpod(id: string, data: IAirpod): Promise<IAirpod> {
    return postRequest<IAirpod[]>(`/api/v1/airpod/update/${id}`, data).then((data) => data[0]);
}

export function insertAirpod(data: IAirpod): Promise<IAirpod> {
    return postRequest<IAirpod[]>(`/api/v1/airpod/create`, data).then((data) => data[0]);
}

// ORDER
export function getOpenedOrders(params: IDefaultParams): Promise<IOrder[]> {
    const {limit, offset} = params;
    return getRequest<IOrder[]>(`/api/v1/orders/opened?limit=${limit}&offset=${offset}`);
}

export interface IOrderEnums {
    statuses: string[];
}

export function getOrderEnums(): Promise<IOrderEnums> {
    return getRequest<IOrderEnums>(`/api/v1/order/enums`);
}

export function updateOrder(id: string, data: IOrder): Promise<IOrder> {
    return postRequest<IOrder[]>(`/api/v1/order/update/${id}`, data).then((data) => data[0]);
}

export function getOrder(id: string): Promise<IOrder> {
    return getRequest<IOrder[]>(`/api/v1/order/id/${id}`).then((data) => data[0]);
}

type OrderStatus = 'reject' | 'bought' | 'called';
export function changeOrderStatus(id: string, status: OrderStatus): Promise<IOrder> {
    return postRequest<IOrder[]>(`/api/v1/order/update/${id}/status`, {status}).then((data) => data[0]);
}

export function getOrderItems(orderId: string): Promise<IOrderItems> {
    return getRequest<IOrderItems>(`/api/v1/order/${orderId}/items`);
}

// ORDER ITEM
export function insertIphoneOrder(orderId: string, iphoneId: string): Promise<any> {
    return postRequest<any[]>(`/api/v1/order/${orderId}/iphone/add`, {id: iphoneId}).then((data) => data[0]);
}

export function deleteIphoneOrder(orderId: string, iphoneId: string): Promise<any> {
    return postRequest<any[]>(`/api/v1/order/${orderId}/iphone/delete`, {id: iphoneId}).then((data) => data[0]);
}

export function insertAirpodOrder(orderId: string, airpodId: string): Promise<any> {
    return postRequest<any[]>(`/api/v1/order/${orderId}/airpod/add`, {id: airpodId}).then((data) => data[0]);
}

export function deleteAirpodOrder(orderId: string, airpodId: string): Promise<any> {
    return postRequest<any[]>(`/api/v1/order/${orderId}/airpod/delete`, {id: airpodId}).then((data) => data[0]);
}
