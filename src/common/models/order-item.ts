import {observable} from 'mobx';
import {GoodItemModel, IGoodItemDbModel} from './good-item';

export interface IOrderItemDbModel {
    id: string;
    order_id: string;
    good_item_id: string;
    serial_number: string | null;
    imei: string | null;
}

export interface IOrderItemModel {
    id: string;
    orderId: string;
    goodItemId: string;
    serialNumber: string | null;
    imei: string | null;
}

export class OrderItemModel implements IOrderItemModel {
    @observable id: string;
    @observable orderId: string;
    @observable goodItemId: string;
    @observable serialNumber: string | null;
    @observable imei: string | null;

    goodItem: GoodItemModel | null = null;

    constructor(orderItem: IOrderItemDbModel, goodItem?: IGoodItemDbModel) {
        this.id = orderItem.id;
        this.orderId = orderItem.order_id;
        this.goodItemId = orderItem.good_item_id;
        this.serialNumber = orderItem.serial_number;
        this.imei = orderItem.imei;

        if (goodItem) {
            this.goodItem = new GoodItemModel(goodItem);
        }
    }

    getDbData(): IOrderItemDbModel {
        return {
            id: this.id,
            order_id: this.orderId,
            good_item_id: this.goodItemId,
            serial_number: this.serialNumber,
            imei: this.imei
        };
    }
}
