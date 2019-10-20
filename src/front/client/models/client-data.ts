import {observable, action} from 'mobx';

import {IClientClientData, IClientSocialLinks} from 'common/types';
import {ClientCookie} from 'client/libs/client-cookie';

interface IGlobal {
    popupContent: React.ReactNode | null;
}

export class ClientDataModel {
    @observable public socialLinks: IClientSocialLinks;
    @observable public cookieAccepted = false;
    @observable public cartItemsCount = 0;
    @observable public global: IGlobal = {
        popupContent: null
    };

    constructor(clientData: IClientClientData) {
        this.socialLinks = clientData.socialLinks;
        this.cookieAccepted = ClientCookie.isCookieAccepted();
    }

    @action public setPopupContent(content: React.ReactNode | null): void {
        this.global.popupContent = content;
    }

    @action public updateCartItemsCount(): void {
        this.cartItemsCount = ClientCookie.getGoodItemIds().length;
    }

    @action public setCookieAccepted(): void {
        this.cookieAccepted = true;
        ClientCookie.setCookieAccepted();
    }
}
