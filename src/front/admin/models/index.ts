import {ClientDataModel, ClientData} from 'admin/models/client-data';
import {AdminPanelPageModel} from 'admin/models/admin-panel';

import {ShopItemPageModel} from 'admin/models/shop-item';
import {GoodPatternPageModel} from 'admin/models/good-pattern';
import {OrderPageModel} from 'admin/models/order';

declare global {
    interface Window {
        clientData: ClientData;
    }
}

export const clientDataModel = new ClientDataModel(window.clientData);
export const adminPanelPageModel = new AdminPanelPageModel();

export const goodPatternPageModel = new GoodPatternPageModel();
export const shopItemPageModel = new ShopItemPageModel();
export const orderPageModel = new OrderPageModel();

delete window.clientData;
