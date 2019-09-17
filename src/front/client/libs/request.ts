import axios from 'axios';

import {IBarItems} from 'client/models/main';

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

export function getBarItems(): Promise<IBarItems> {
    return getRequest<IBarItems>('/api/v1//public/bar-items');
}
