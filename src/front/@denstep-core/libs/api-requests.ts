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

export interface IGoodItem {
    id: string;
    type: 'iphone' | 'airpod';
    brand: string | null;
    color: string | null;
    model: string | null;
    memory_capacity: number | null;
    search_tags: string[] | null;
    price: number;
    discount: number;
    public: boolean;
    original: boolean;
}

interface IGoodItemsResponse {
    total: number;
    rows: IGoodItem[];
}

export class AdminRequest {
    static getGoodItems(params: IDefaultParams): Promise<IGoodItemsResponse> {
        const {limit, offset} = params;
        return getRequest<IGoodItemsResponse>(`/api/v1/good_item?limit=${limit}&offset=${offset}`);
    }

    static getGoodItem(id: string): Promise<IGoodItem> {
        return getRequest<IGoodItem>(`/api/v1/good_item/${id}`);
    }
}

export class ClientRequest {

}
