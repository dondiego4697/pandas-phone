import axios from 'axios';

import {IGetGoodItemsResponse, IGetOrdersResponse, IGetOrderItemResponse} from '../types';
import {IGoodItemDbModel} from '../models/good-item';
import {IOrderDbModel} from '../models/order';
import {IOrderItemDbModel} from 'common/models/order-item';

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

interface IGetGoodItems extends IDefaultParams {
    type: string[];
    isPublic: string[];
}

export class AdminRequest {
    static getGoodItems(params: IGetGoodItems): Promise<IGetGoodItemsResponse> {
        const {limit, offset, type, isPublic} = params;
        return getRequest<IGetGoodItemsResponse>(
            '/api/v1/good_item?' +
            [
                `limit=${limit}`,
                `offset=${offset}`,
                `type=${type.join(',')}`,
                `public=${isPublic.join(',')}`
            ].join('&')
        );
    }

    static getGoodItem(id: string): Promise<IGoodItemDbModel> {
        return getRequest<IGoodItemDbModel>(`/api/v1/good_item/${id}`);
    }

    static createGoodItem(goodItem: IGoodItemDbModel): Promise<IGoodItemDbModel> {
        return postRequest<IGoodItemDbModel>('/api/v1/good_item/create', goodItem);
    }

    static updateGoodItem(goodItem: IGoodItemDbModel): Promise<IGoodItemDbModel> {
        const {id} = goodItem;
        delete goodItem.id;

        return postRequest<IGoodItemDbModel>(`/api/v1/good_item/${id}/update`, goodItem);
    }

    static deleteGoodItem(id: string): Promise<IGoodItemDbModel> {
        return postRequest<IGoodItemDbModel>(`/api/v1/good_item/${id}/delete`, {});
    }

    static getOrders(params: IDefaultParams): Promise<IGetOrdersResponse> {
        const {limit, offset} = params;
        return getRequest<IGetOrdersResponse>(`/api/v1/order?limit=${limit}&offset=${offset}`);
    }

    static getOrder(id: string): Promise<IOrderDbModel> {
        return getRequest<IOrderDbModel>(`/api/v1/order/${id}`);
    }

    static getOrderItems(id: string): Promise<IGetOrderItemResponse[]> {
        return getRequest<IGetOrderItemResponse[]>(`/api/v1/order/${id}/items`);
    }

    static createOrder(order: IOrderDbModel): Promise<IOrderDbModel> {
        return postRequest<IOrderDbModel>('/api/v1/order/create', order);
    }

    static updateOrder(order: IOrderDbModel): Promise<IOrderDbModel> {
        const {id} = order;
        delete order.id;

        return postRequest<IOrderDbModel>(`/api/v1/order/${id}/update`, order);
    }

    static resolveOrder(id: string): Promise<IOrderDbModel> {
        return postRequest<IOrderDbModel>(`/api/v1/order/${id}/update`, {
            _status_v1: 'resolve'
        });
    }

    static rejectOrder(id: string): Promise<IOrderDbModel> {
        return postRequest<IOrderDbModel>(`/api/v1/order/${id}/update`, {
            _status_v1: 'reject'
        });
    }

    static deleteOrderItem(id: string): Promise<IOrderItemDbModel> {
        return postRequest<IOrderItemDbModel>(`/api/v1/order_item/${id}/delete`, {});
    }

    static getOrderItem(id: string): Promise<IGetOrderItemResponse> {
        return getRequest<IGetOrderItemResponse>(`/api/v1/order_item/${id}`);
    }

    static createOrderItem(orderId: string, orderItem: IOrderItemDbModel): Promise<IOrderItemDbModel> {
        const body = {
            order_id: orderId,
            good_item_id: orderItem.good_item_id,
            serial_number: orderItem.serial_number,
            imei: orderItem.imei
        };
        return postRequest<IOrderItemDbModel>('/api/v1/order_item/create', body);
    }

    static updateOrderItem(orderItem: IOrderItemDbModel): Promise<IOrderItemDbModel> {
        const body = {
            good_item_id: orderItem.good_item_id,
            serial_number: orderItem.serial_number,
            imei: orderItem.imei
        };
        return postRequest<IOrderItemDbModel>(`/api/v1/order_item/${orderItem.id}/update`, body);
    }
}

export class ClientRequest {

}
