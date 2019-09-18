import {ClientDataModel, IClientData} from 'client/models/client-data';
import {MainPageModel} from 'client/models/main';
import {CartPageModel} from 'client/models/cart';

declare global {
    // tslint:disable-next-line
    interface Window {
        clientData: IClientData;
    }
}

export const clientDataModel = new ClientDataModel(window.clientData);
export const mainPageModel = new MainPageModel();
export const cartPageModel = new CartPageModel();

delete window.clientData;
