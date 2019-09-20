import axios from 'axios';

import {IBarItems} from 'client/models/main';

interface IDefaultParams {
    limit: number;
    offset: number;
}
const config = {
    withCredentials: true,
    timeout: 3000
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
    return getRequest<IBarItems>('/api/v1/public/bar-items');
}

export function addOrder(
    customerName: string,
    customerPhone: string,
    airpodIds: string[],
    iphoneIds: string[]
): Promise<any> {
    return postRequest<any>('/api/v1/public/add-order', {
        airpodIds,
        iphoneIds,
        customer: {
            name: customerName,
            phone: customerPhone
        }
    });
}
