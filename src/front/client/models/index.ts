import {ClientDataModel, IClientData} from 'client/models/client-data';

declare global {
    // tslint:disable-next-line
    interface Window {
        clientData: IClientData;
    }
}

export const clientDataModel = new ClientDataModel(window.clientData);

delete window.clientData;
