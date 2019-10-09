import {observable} from 'mobx';

import {IClientClientData, IClientSocialLinks} from 'common/types';

export class ClientDataModel {
    @observable public socialLinks: IClientSocialLinks;

    constructor(clientData: IClientClientData) {
        this.socialLinks = clientData.socialLinks;
    }
}
