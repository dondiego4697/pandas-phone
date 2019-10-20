import {IOrderItemDbModel} from './models/order-item';
import {IGoodItemDbModel} from './models/good-item';
import {IOrderDbModel} from './models/order';

export interface IAdminClientData {
    readonly forbidden: boolean;
    readonly authUrl: string;
}

export interface IClientClientData {
    readonly socialLinks: IClientSocialLinks;
}

export interface IClientSocialLinks {
    vk: string;
    instagram: string;
}

export interface IGetOrderItemResponse {
    orderItem: IOrderItemDbModel;
    goodItem: IGoodItemDbModel;
};

export interface IGetGoodItemsResponse {
    total: number;
    rows: IGoodItemDbModel[];
}

export interface IGetOrdersResponse {
    total: number;
    rows: IOrderDbModel[];
}
