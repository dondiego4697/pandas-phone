// import axios from 'axios';

// import {IIphone, IIphoneFull} from 'admin/models/ARCHIVE/iphones';
// import {IAirpod, IAirpodFull} from 'admin/models/ARCHIVE/airpods';
// import {IOrder} from 'admin/models/ARCHIVE/orders';
// import {IOrderItems} from 'admin/models/ARCHIVE/order';

// interface IDefaultParams {
//     limit: number;
//     offset: number;
// }

// function getRequest<T>(url: string): Promise<T> {
//     return axios
//         .get(url)
//         .then((response) => response.data);
// }

// function postRequest<T>(url: string, data: any): Promise<T> {
//     return axios
//         .post(url, data)
//         .then((response) => response.data);
// }

// function deleteRequest<T>(url: string, data: any): Promise<T> {
//     return axios
//         .delete(url, data)
//         .then((response) => response.data);
// }

// // ENUMS
// export interface IOrderEnums {
//     statuses: string[];
// }

// export function getOrderEnums(): Promise<IOrderEnums> {
//     return getRequest<IOrderEnums>(`/api/v2/order/enums`);
// }

// interface IIphoneEnums {
//     models: string[];
//     colors: string[];
//     memories: string[];
// }

// export function getIphoneEnums(): Promise<IIphoneEnums> {
//     return getRequest<IIphoneEnums>(`/api/v2/order_iphone/enums`);
// }

// interface IAirpodEnums {
//     series: string[];
// }

// export function getAirpodsEnums(): Promise<IAirpodEnums> {
//     return getRequest<IAirpodEnums>(`/api/v2/order_airpod/enums`);
// }

// // IPHONE
// export function getIphonesBar(params: IDefaultParams): Promise<IIphone[]> {
//     const {limit, offset} = params;
//     return getRequest<IIphone[]>(`/api/v2/bar_iphone/items?limit=${limit}&offset=${offset}`);
// }

// export function deleteIphoneBar(id: string): Promise<IIphone> {
//     return deleteRequest<IIphone[]>(`/api/v2/bar_iphone/${id}`, {}).then((data) => data[0]);
// }

// export function updateIphoneBar(id: string, data: IIphone): Promise<IIphone> {
//     return postRequest<IIphone[]>(`/api/v2/bar_iphone/update/${id}`, data).then((data) => data[0]);
// }

// export function insertIphoneBar(data: IIphone): Promise<IIphone> {
//     return postRequest<IIphone[]>(`/api/v2/bar_iphone/create`, data).then((data) => data[0]);
// }

// // AIRPOD
// export function getAirpodsBar(params: IDefaultParams): Promise<IAirpod[]> {
//     const {limit, offset} = params;
//     return getRequest<IAirpod[]>(`/api/v2/bar_airpod/items?limit=${limit}&offset=${offset}`);
// }

// export function deleteAirpodBar(id: string): Promise<IAirpod> {
//     return deleteRequest<IAirpod[]>(`/api/v2/bar_airpod/${id}`, {}).then((data) => data[0]);
// }

// export function updateAirpodBar(id: string, data: IAirpod): Promise<IAirpod> {
//     return postRequest<IAirpod[]>(`/api/v2/bar_airpod/update/${id}`, data).then((data) => data[0]);
// }

// export function insertAirpodBar(data: IAirpod): Promise<IAirpod> {
//     return postRequest<IAirpod[]>(`/api/v2/bar_airpod/create`, data).then((data) => data[0]);
// }

// // ORDER
// export function getOpenedOrders(params: IDefaultParams): Promise<IOrder[]> {
//     const {limit, offset} = params;
//     return getRequest<IOrder[]>(`/api/v2/order/opened?limit=${limit}&offset=${offset}`);
// }

// export function insertOrder(data: IOrder): Promise<IOrder> {
//     return postRequest<IOrder[]>('/api/v2/order/create', data).then((data) => data[0]);
// }

// export function updateOrder(id: string, data: IOrder): Promise<IOrder> {
//     return postRequest<IOrder[]>(`/api/v2/order/${id}/update`, data).then((data) => data[0]);
// }

// export function getOrder(id: string): Promise<IOrder> {
//     return getRequest<IOrder[]>(`/api/v2/order/${id}/get`).then((data) => data[0]);
// }

// export function changeOrderStatus(id: string, status: string): Promise<IOrder> {
//     return postRequest<IOrder[]>(`/api/v2/order/${id}/update_status`, {status}).then((data) => data[0]);
// }

// export function getOrderItems(orderId: string): Promise<IOrderItems> {
//     return getRequest<IOrderItems>(`/api/v2/order/${orderId}/items`);
// }

// // ORDER ITEM
// export function insertIphoneOrder(orderId: string, item: IIphoneFull): Promise<any> {
//     return postRequest<any[]>(`/api/v2/order/${orderId}/action_iphone/create`, item).then((data) => data[0]);
// }

// export function updateIphoneOrder(orderId: string, item: IIphoneFull): Promise<any> {
//     return postRequest<any[]>(`/api/v2/order/${orderId}/action_iphone/update`, item).then((data) => data[0]);
// }

// export function deleteIphoneOrder(orderId: string, iphoneId: string): Promise<any> {
//     return postRequest<any[]>(`/api/v2/order/${orderId}/action_iphone/delete`, {id: iphoneId}).then((data) => data[0]);
// }

// export function insertAirpodOrder(orderId: string, item: IAirpodFull): Promise<any> {
//     return postRequest<any[]>(`/api/v2/order/${orderId}/action_airpod/create`, item).then((data) => data[0]);
// }

// export function deleteAirpodOrder(orderId: string, airpodId: string): Promise<any> {
//     return postRequest<any[]>(`/api/v2/order/${orderId}/action_airpod/delete`, {id: airpodId}).then((data) => data[0]);
// }

// export function updateAirpodOrder(orderId: string, item: IAirpodFull): Promise<any> {
//     return postRequest<any[]>(`/api/v2/order/${orderId}/action_airpod/update`, item).then((data) => data[0]);
// }
