import axios from 'axios';

import {IIphone, IIphoneFull} from 'admin/models/iphones';
import {IAirpod, IAirpodFull} from 'admin/models/airpods';
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
export function getIphonesBar(params: IDefaultParams): Promise<IIphone[]> {
    const {limit, offset} = params;
    return getRequest<IIphone[]>(`/api/v1/bar/iphones?limit=${limit}&offset=${offset}`);
}

interface IIphoneEnums {
    models: string[];
    colors: string[];
    memories: string[];
}

export function getIphoneEnums(): Promise<IIphoneEnums> {
    return getRequest<IIphoneEnums>(`/api/v1/iphone/enums`);
}

export function deleteIphoneBar(id: string): Promise<IIphone> {
    return deleteRequest<IIphone[]>(`/api/v1/bar/iphone/${id}`, {}).then((data) => data[0]);
}

export function updateIphoneBar(id: string, data: IIphone): Promise<IIphone> {
    return postRequest<IIphone[]>(`/api/v1/bar/iphone/update/${id}`, data).then((data) => data[0]);
}

export function insertIphoneBar(data: IIphone): Promise<IIphone> {
    return postRequest<IIphone[]>(`/api/v1/bar/iphone/create`, data).then((data) => data[0]);
}

// AIRPOD
export function getAirpodsBar(params: IDefaultParams): Promise<IAirpod[]> {
    const {limit, offset} = params;
    return getRequest<IAirpod[]>(`/api/v1/bar/airpods?limit=${limit}&offset=${offset}`);
}

interface IAirpodEnums {
    series: string[];
}

export function getAirpodsEnums(): Promise<IAirpodEnums> {
    return getRequest<IAirpodEnums>(`/api/v1/airpod/enums`);
}

export function deleteAirpodBar(id: string): Promise<IAirpod> {
    return deleteRequest<IAirpod[]>(`/api/v1/bar/airpod/${id}`, {}).then((data) => data[0]);
}

export function updateAirpodBar(id: string, data: IAirpod): Promise<IAirpod> {
    return postRequest<IAirpod[]>(`/api/v1/bar/airpod/update/${id}`, data).then((data) => data[0]);
}

export function insertAirpodBar(data: IAirpod): Promise<IAirpod> {
    return postRequest<IAirpod[]>(`/api/v1/bar/airpod/create`, data).then((data) => data[0]);
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
export function insertIphoneOrder(orderId: string, item: IIphoneFull): Promise<any> {
    return postRequest<any[]>(`/api/v1/order/${orderId}/iphone/add`, item).then((data) => data[0]);
}

export function updateIphoneOrder(orderId: string, item: IIphoneFull): Promise<any> {
    return postRequest<any[]>(`/api/v1/order/${orderId}/iphone/update`, item).then((data) => data[0]);
}

export function deleteIphoneOrder(orderId: string, iphoneId: string): Promise<any> {
    return postRequest<any[]>(`/api/v1/order/${orderId}/iphone/delete`, {id: iphoneId}).then((data) => data[0]);
}

export function insertAirpodOrder(orderId: string, item: IAirpodFull): Promise<any> {
    return postRequest<any[]>(`/api/v1/order/${orderId}/airpod/add`, item).then((data) => data[0]);
}

export function deleteAirpodOrder(orderId: string, airpodId: string): Promise<any> {
    return postRequest<any[]>(`/api/v1/order/${orderId}/airpod/delete`, {id: airpodId}).then((data) => data[0]);
}

export function updateAirpodOrder(orderId: string, item: IAirpodFull): Promise<any> {
    return postRequest<any[]>(`/api/v1/order/${orderId}/airpod/update`, item).then((data) => data[0]);
}
