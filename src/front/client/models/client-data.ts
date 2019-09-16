import {observable} from 'mobx';

export interface IClientData {
    readonly isMobile: boolean;
}

export class ClientDataModel {
    @observable public isMobile: boolean;

    constructor(clientData: IClientData) {
        this.isMobile = clientData.isMobile;
    }
}
