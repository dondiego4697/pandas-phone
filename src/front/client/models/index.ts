import {ClientDataModel, ClientData} from 'client/models/client-data';

declare global {
    interface Window {
        clientData: ClientData;
    }
}

export const clientDataModel = new ClientDataModel(window.clientData);

delete window.clientData;
