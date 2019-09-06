import {observable, action} from 'mobx';

export interface ClientData {
    readonly forbidden: boolean;
    readonly telegramBotName: string;
}

interface TableTab {
    tableDbName: string;
    label: string;
}

export class ClientDataModel {
    @observable forbidden: boolean;
    @observable telegramBotName: string;
    @observable tableTabs: TableTab[];
    @observable tabItem: number;

    constructor(clientData: ClientData) {
        this.forbidden = clientData.forbidden;
        this.telegramBotName = clientData.telegramBotName;

        this.tabItem = 0;
        this.tableTabs = [{
            tableDbName: 'good',
            label: 'Товар'
        }, {
            tableDbName: 'shop',
            label: 'Магазин'
        }, {
            tableDbName: 'good_type',
            label: 'Тип товара'
        }, {
            tableDbName: 'good_brand',
            label: 'Бренд'
        }, {
            tableDbName: 'good_brand_product',
            label: 'Продукт бренда'
        }, {
            tableDbName: 'shop_statistic',
            label: 'Статистика'
        }];
    }

    @action setTabItem(newValue: number): void {
        this.tabItem = newValue;
    }
}
