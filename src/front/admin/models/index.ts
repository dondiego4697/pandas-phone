import {ClientDataModel} from 'admin/models/client-data';
import {IAdminClientData} from 'common/types';
import {AdminPanelPageModel} from 'admin/models/admin-panel';

import {GoodItemsPageModel} from 'admin/models/good-items';
import {GoodItemEditPageModel} from 'admin/models/good-item-edit';

declare global {
    // tslint:disable-next-line
    interface Window {
        clientData: IAdminClientData;
    }
}

export const clientDataModel = new ClientDataModel(window.clientData);
export const adminPanelPageModel = new AdminPanelPageModel();

export const goodItemsPageModel = new GoodItemsPageModel();
export const goodItemEditPageModel = new GoodItemEditPageModel();

delete window.clientData;
