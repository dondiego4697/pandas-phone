import {ClientDataModel, IClientData} from 'admin/models/client-data';
import {AdminPanelPageModel} from 'admin/models/admin-panel';

import {IphonesPageModel} from 'admin/models/iphones';
import {AirpodsPageModel} from 'admin/models/airpods';
import {OrdersPageModel} from 'admin/models/orders';
import {OrderPageModel} from 'admin/models/order';

declare global {
    // tslint:disable-next-line
    interface Window {
        clientData: IClientData;
    }
}

export const clientDataModel = new ClientDataModel(window.clientData);
export const adminPanelPageModel = new AdminPanelPageModel();

export const iphonesPageModel = new IphonesPageModel();
export const airpodsPageModel = new AirpodsPageModel();
export const ordersPageModel = new OrdersPageModel();
export const orderPageModel = new OrderPageModel();

delete window.clientData;
