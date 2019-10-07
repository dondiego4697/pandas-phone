import axios from 'axios';

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

interface IGoodItemBase {
    type: 'iphone' | 'airpod';
    brand: string | null;
    color: string | null;
    model: string | null;
    memory_capacity: number | null;
    search_tags: string[];
    original: boolean;
    price: number;
    discount: number;
}

export interface IGoodItem extends IGoodItemBase {
    id: string;
    public: boolean;
    updated: string;
}

interface IGoodItemsResponse {
    total: number;
    rows: IGoodItem[];
}

export interface IOrder {
    id: string;
    called: boolean;
    customer_name: string;
    customer_phone: string;
    order_date: string;
    _status_v1: string | null;
}

interface IOrdersResponse {
    total: number;
    rows: IOrder[];
}

export interface IOrderItemFull extends IOrderItem, IGoodItemBase {}

export interface IOrderItem {
    id: string;
    good_item_id: string;
    order_item_id: string;
    serial_number: string | null;
    imei: string | null;
}

interface IGetGoodItems extends IDefaultParams {
    type: string[];
    isPublic: string[];
}

export class AdminRequest {
    static getGoodItems(params: IGetGoodItems): Promise<IGoodItemsResponse> {
        const {limit, offset, type, isPublic} = params;
        return getRequest<IGoodItemsResponse>(
            '/api/v1/good_item?' +
            [
                `limit=${limit}`,
                `offset=${offset}`,
                `type=${type.join(',')}`,
                `public=${isPublic.join(',')}`
            ].join('&')
        );
    }

    static getGoodItem(id: string): Promise<IGoodItem> {
        return getRequest<IGoodItem>(`/api/v1/good_item/${id}`);
    }

    static createGoodItem(goodItem: IGoodItem): Promise<IGoodItem> {
        return postRequest<IGoodItem>('/api/v1/good_item/create', goodItem);
    }

    static updateGoodItem(goodItem: IGoodItem): Promise<IGoodItem> {
        const {id} = goodItem;
        delete goodItem.id;

        return postRequest<IGoodItem>(`/api/v1/good_item/${id}/update`, goodItem);
    }

    static deleteGoodItem(id: string): Promise<IGoodItem> {
        return postRequest<IGoodItem>(`/api/v1/good_item/${id}/delete`, {});
    }

    static getOrders(params: IDefaultParams): Promise<IOrdersResponse> {
        const {limit, offset} = params;
        return getRequest<IOrdersResponse>(`/api/v1/order?limit=${limit}&offset=${offset}`);
    }

    static getOrder(id: string): Promise<IOrder> {
        return getRequest<IOrder>(`/api/v1/order/${id}`);
    }

    static getOrderItems(id: string): Promise<IOrderItemFull[]> {
        return getRequest<IOrderItemFull[]>(`/api/v1/order/${id}/items`);
    }

    static createOrder(order: IOrder): Promise<IOrder> {
        return postRequest<IOrder>('/api/v1/order/create', order);
    }

    static updateOrder(order: IOrder): Promise<IOrder> {
        const {id} = order;
        delete order.id;

        return postRequest<IOrder>(`/api/v1/order/${id}/update`, order);
    }

    static resolveOrder(id: string): Promise<IOrder> {
        return postRequest<IOrder>(`/api/v1/order/${id}/update`, {
            _status_v1: 'resolve'
        });
    }

    static rejectOrder(id: string): Promise<IOrder> {
        return postRequest<IOrder>(`/api/v1/order/${id}/update`, {
            _status_v1: 'reject'
        });
    }

    static deleteOrderItem(id: string): Promise<IOrderItem> {
        return postRequest<IOrderItem>(`/api/v1/order_item/${id}/delete`, {});
    }

    static getOrderItem(id: string): Promise<IOrderItem> {
        return getRequest<IOrderItem>(`/api/v1/order_item/${id}`);
    }

    static createOrderItem(orderId: string, orderItem: IOrderItem): Promise<IOrderItem> {
        const body = {
            order_id: orderId,
            good_item_id: orderItem.good_item_id,
            serial_number: orderItem.serial_number,
            imei: orderItem.imei
        };
        return postRequest<IOrderItem>('/api/v1/order_item/create', body);
    }

    static updateOrderItem(orderItem: IOrderItem): Promise<IOrderItem> {
        const body = {
            good_item_id: orderItem.good_item_id,
            serial_number: orderItem.serial_number,
            imei: orderItem.imei
        };
        return postRequest<IOrderItem>(`/api/v1/order_item/${orderItem.order_item_id}/update`, body);
    }
}

export class ClientRequest {

}
