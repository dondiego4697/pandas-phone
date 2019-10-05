import {ClientDataModel} from 'admin/models/client-data';
import {IAdminClientData} from 'common/types';

import {GoodItemsPageModel} from 'admin/models/good-items';
import {GoodItemPageModel} from 'admin/models/good-item';
import {OrdersPageModel} from 'admin/models/orders';
import {OrderPageModel} from 'admin/models/order';
import {OrderItemPageModel} from 'admin/models/order-item';

declare global {
    // tslint:disable-next-line
    interface Window {
        clientData: IAdminClientData;
    }
}

export const clientDataModel = new ClientDataModel(window.clientData);

export const goodItemsPageModel = new GoodItemsPageModel();
export const goodItemPageModel = new GoodItemPageModel();
export const ordersPageModel = new OrdersPageModel();
export const orderPageModel = new OrderPageModel();
export const orderItemPageModel = new OrderItemPageModel();

delete window.clientData;
