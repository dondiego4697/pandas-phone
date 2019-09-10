import {observable} from 'mobx';

export interface IClientData {
    readonly forbidden: boolean;
    readonly telegramBotName: string;
}

export class ClientDataModel {
    @observable public forbidden: boolean;
    @observable public telegramBotName: string;

    constructor(clientData: IClientData) {
        this.forbidden = clientData.forbidden;
        this.telegramBotName = clientData.telegramBotName;
    }
}
