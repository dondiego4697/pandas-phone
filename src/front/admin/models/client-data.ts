import {observable, action} from 'mobx';

export interface ClientData {
    readonly forbidden: boolean;
    readonly telegramBotName: string;
}

export class ClientDataModel {
    @observable forbidden: boolean;
    @observable telegramBotName: string;
    @observable tabItem: number;

    constructor(clientData: ClientData) {
        this.forbidden = clientData.forbidden;
        this.telegramBotName = clientData.telegramBotName;

        this.tabItem = 0;
    }

    @action setTabItem(newValue: number): void {
        this.tabItem = newValue;
    }
}
