import axios from 'axios';

import {GoodBrand} from 'admin/models/good-brand';

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

export function getTables(): Promise<string[]> {
    return getRequest<string[]>(`/proxy/tables`);
}

export function getGoodBrands(params: DefaultParams): Promise<GoodBrand[]> {
    const {limit, offset} = params;
    return getRequest<GoodBrand[]>(`/proxy/good-brand?limit=${limit}&offset=${offset}`);
}

export function getGoodBrandsColumns(): Promise<string[]> {
    return getRequest<string[]>(`/proxy/good-brand/columns`);
}
/* export function getDataFromDB(tableName: string): Promise<any[]> {
    // TODO make pagination
    return getRequest<any[]>(`/proxy/${tableName.replace(/\_/gmi, '-')}`);
}

export function insertDataToDB(tableName: string, data: any): Promise<any[]> {
    return postRequest<any[]>(`/proxy/${tableName.replace(/\_/gmi, '-')}`, data);
} */
