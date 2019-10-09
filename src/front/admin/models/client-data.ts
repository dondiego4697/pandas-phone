import {observable, action} from 'mobx';

import {IAdminClientData} from 'common/types';

interface IGlobal {
    popupContent: React.ReactNode | null;
}

export class ClientDataModel {
    @observable public forbidden: boolean;
    @observable public authUrl: string;
    @observable public global: IGlobal = {
        popupContent: null
    };

    constructor(clientData: IAdminClientData) {
        this.forbidden = clientData.forbidden;
        this.authUrl = clientData.authUrl;
    }

    @action public setPopupContent(content: React.ReactNode | null): void {
        this.global.popupContent = content;
    }
}
