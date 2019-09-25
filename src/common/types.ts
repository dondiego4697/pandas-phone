import {IDbAllowedValues} from './db-allowed-values';

export interface IAdminClientData {
    readonly forbidden: boolean;
    readonly telegramBotName: string;
    readonly dbAllowedValues: IDbAllowedValues;
}

export interface IClientClientData {
    readonly isMobile: boolean;
    readonly socialLinks: IClientSocialLinks;
    readonly dbAllowedValues: IDbAllowedValues;
}

export interface IClientSocialLinks {
    vk: string;
    instagram: string;
}
