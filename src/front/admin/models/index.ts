import {ClientDataModel, ClientData} from 'admin/models/client-data';
import {AdminPanelPageModel} from 'admin/models/admin-panel';
import {GoodBrandPageModel} from 'admin/models/good-brand';

declare global {
    interface Window {
        clientData: ClientData;
    }
}

export const clientDataModel = new ClientDataModel(window.clientData);
export const adminPanelPageModel = new AdminPanelPageModel();
export const goodBrandPageModel = new GoodBrandPageModel();

delete window.clientData;
