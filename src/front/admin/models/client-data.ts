import {observable, action} from 'mobx';

import {IAdminClientData} from 'common/types';
import {IDbAllowedValues} from 'common/db-allowed-values';

interface IGlobal {
    popupContent: React.ReactNode | null;
}

export class ClientDataModel {
    @observable public forbidden: boolean;
    @observable public authUrl: string;
    @observable public dbAllowedValues: IDbAllowedValues;
    @observable public global: IGlobal = {
        popupContent: null
    };

    constructor(clientData: IAdminClientData) {
        this.forbidden = clientData.forbidden;
        this.authUrl = clientData.authUrl;
        this.dbAllowedValues = clientData.dbAllowedValues;
    }

    @action public setPopupContent(content: React.ReactNode | null): void {
        this.global.popupContent = content;
    }
}
