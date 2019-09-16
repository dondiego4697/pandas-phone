import {ClientDataModel, IClientData} from 'client/models/client-data';
import {MainPageModel} from 'client/models/main';

declare global {
    // tslint:disable-next-line
    interface Window {
        clientData: IClientData;
    }
}

export const clientDataModel = new ClientDataModel(window.clientData);
export const mainPageModel = new MainPageModel();

delete window.clientData;
