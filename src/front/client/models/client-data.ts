import {observable} from 'mobx';

import {IClientClientData, IClientSocialLinks} from 'common/types';
import {IDbAllowedValues} from 'common/db-allowed-values';

export class ClientDataModel {
    @observable public isMobile: boolean;
    @observable public socialLinks: IClientSocialLinks;
    @observable public dbAllowedValues: IDbAllowedValues;

    constructor(clientData: IClientClientData) {
        this.isMobile = clientData.isMobile;
        this.socialLinks = clientData.socialLinks;
        this.dbAllowedValues = clientData.dbAllowedValues;
    }
}
