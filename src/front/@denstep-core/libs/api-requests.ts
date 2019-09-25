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

export class AdminRequest {
    static getGoodItems(params: IDefaultParams): Promise<any[]> {
        const {limit, offset} = params;
        return getRequest<any[]>(`/api/v1/good_item?limit=${limit}&offset=${offset}`);
    }
}

export class ClientRequest {

}
