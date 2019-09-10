import {ClientDataModel, IClientData} from 'admin/models/client-data';
import {AdminPanelPageModel} from 'admin/models/admin-panel';

import {IphonePageModel} from 'admin/models/iphone';
import {AirpodsPageModel} from 'admin/models/airpods';
import {OrdersPageModel} from 'admin/models/orders';

declare global {
    // tslint:disable-next-line
    interface Window {
        clientData: IClientData;
    }
}

export const clientDataModel = new ClientDataModel(window.clientData);
export const adminPanelPageModel = new AdminPanelPageModel();

export const iphonePageModel = new IphonePageModel();
export const airpodsPageModel = new AirpodsPageModel();
export const ordersPageModel = new OrdersPageModel();

delete window.clientData;
