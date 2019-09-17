import {observable} from 'mobx';

export interface ISocialLinks {
    vk: string;
    instagram: string;
}

export interface IClientData {
    readonly isMobile: boolean;
    readonly socialLinks: ISocialLinks;
}

export class ClientDataModel {
    @observable public isMobile: boolean;
    @observable public socialLinks: ISocialLinks;

    constructor(clientData: IClientData) {
        this.isMobile = clientData.isMobile;
        this.socialLinks = clientData.socialLinks;
    }
}
