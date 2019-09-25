import {observable} from 'mobx';

import {IAdminClientData} from 'common/types';
import {IDbAllowedValues} from 'common/db-allowed-values';

export class ClientDataModel {
    @observable public forbidden: boolean;
    @observable public telegramBotName: string;
    @observable public dbAllowedValues: IDbAllowedValues;

    constructor(clientData: IAdminClientData) {
        this.forbidden = clientData.forbidden;
        this.telegramBotName = clientData.telegramBotName;
        this.dbAllowedValues = clientData.dbAllowedValues;
    }
}
