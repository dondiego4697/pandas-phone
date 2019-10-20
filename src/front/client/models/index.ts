import {ClientDataModel} from 'client/models/client-data';
import {IClientClientData} from 'common/types';
import {MainPageModel} from 'client/models/main';
import {CartPageModel} from 'client/models/cart';

declare global {
    // tslint:disable-next-line
    interface Window {
        clientData: IClientClientData;
    }
}

export const clientDataModel = new ClientDataModel(window.clientData);
export const mainPageModel = new MainPageModel();
export const cartPageModel = new CartPageModel();

delete window.clientData;
