import axios from 'axios';

import {IBarItems} from 'client/models/main';

const config = {
    timeout: 5000,
    withCredentials: true
};

function getRequest<T>(url: string): Promise<T> {
    return axios
        .get(url, config)
        .then((response) => response.data);
}

function postRequest<T>(url: string, data: any): Promise<T> {
    return axios
        .post(url, data, config)
        .then((response) => response.data);
}

export function getBarItems(): Promise<IBarItems> {
    return getRequest<IBarItems>('/api/v2/public/bar_items');
}

export function addOrder(
    customerName: string,
    customerPhone: string,
    airpodIds: string[],
    iphoneIds: string[]
): Promise<any> {
    return postRequest<any>('/api/v2/public/add_customer_order', {
        airpodIds,
        customer: {
            name: customerName,
            phone: customerPhone
        },
        iphoneIds
    });
}
