import {ClientDataModel} from 'admin/models/client-data';
import {IAdminClientData} from 'common/types';
import {AdminPanelPageModel} from 'admin/models/admin-panel';

import {GoodItemsPageModel} from 'admin/models/good-items';

declare global {
    // tslint:disable-next-line
    interface Window {
        clientData: IAdminClientData;
    }
}

export const clientDataModel = new ClientDataModel(window.clientData);
export const adminPanelPageModel = new AdminPanelPageModel();

export const goodItemsPageModel = new GoodItemsPageModel();

delete window.clientData;
