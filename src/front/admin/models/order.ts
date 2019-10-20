import {observable, action, runInAction} from 'mobx';

import {PageStatus} from '@denstep-core/libs/types';
import {ITableSchema} from '@denstep-core/components/table';
import {getPriceWithDiscount, priceToString} from '@denstep-core/libs/get-price';
import {GOOD_ITEMS_TABLE_SCHEMA as GOOD_ITEMS_TABLE_SCHEMA_BASE} from 'admin/models/good-items';
import {OrderItemModel, IOrderItemDbModel} from 'common/models/order-item';
import {OrderModel, IOrderDbModel, IOrderModel} from 'common/models/order';
import {AdminRequest} from 'common/libs/api-requests';
import {GoodItemModel, IGoodItemModel} from 'common/models/good-item';
import {textDictionary} from 'common/text-dictionary';

const DEFAULT_ORDER = new OrderModel({
    customer_name: '',
    customer_phone: '',
    called: false,
    order_date: ''
});

const NEW_ID = 'new';

export class OrderPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public order = DEFAULT_ORDER;
    @observable public orderItems: OrderItemModel[] = [];
    @observable public isNewOrder = true;
    @observable public totalPrice = '';

    @action public fetchData(orderId: string): Promise<void> {
        this.isNewOrder = orderId === NEW_ID;

        return new Promise((resolve, reject) => {
            runInAction(() => {
                this.status = PageStatus.LOADING;
                if (this.isNewOrder) {
                    this.status = PageStatus.DONE;
                    resolve();
                    return;
                }

                Promise.all([
                    AdminRequest.getOrder(orderId),
                    AdminRequest.getOrderItems(orderId)
                ])
                .then(([order, orderItems]) => {
                    this.order = new OrderModel(order);
                    this.orderItems = orderItems.map((item) => {
                        return new OrderItemModel(
                            item.orderItem,
                            item.goodItem
                        );
                    });
                    this.calcTotalPrice();
                })
                .catch(reject)
                .finally(() => {
                    this.status = PageStatus.DONE;
                });
            });
        });
    }

    @action public deleteOrderItem(id: string): Promise<IOrderItemDbModel> {
        this.status = PageStatus.LOADING;

        return AdminRequest
            .deleteOrderItem(id)
            .finally(() => {
                this.status = PageStatus.DONE;
            });
    }

    @action public clearData(): void {
        this.order = DEFAULT_ORDER;
    }

    @action public updateOrder(): Promise<IOrderDbModel> {
        this.status = PageStatus.LOADING;

        if (this.isNewOrder) {
            return AdminRequest
                .createOrder(beautifyOrder(this.order))
                .finally(() => {
                    this.status = PageStatus.DONE;
                });
        }

        return AdminRequest
            .updateOrder(beautifyOrder(this.order))
            .finally(() => {
                this.status = PageStatus.DONE;
            });
    }

    @action public resolveOrder(id: string): Promise<IOrderDbModel> {
        this.status = PageStatus.LOADING;
        return AdminRequest
            .resolveOrder(id)
            .finally(() => {
                this.status = PageStatus.DONE;
            });
    }

    @action public rejectOrder(id: string): Promise<IOrderDbModel> {
        this.status = PageStatus.LOADING;

        return AdminRequest
            .rejectOrder(id)
            .finally(() => {
                this.status = PageStatus.DONE;
            });
    }

    @action public calcTotalPrice(): void {
        const totalPrice = this.orderItems.reduce(
            (result, order) => result + getPriceWithDiscount(order.goodItem!.price, order.goodItem!.discount),
            0
        );

        this.totalPrice = priceToString(totalPrice);
    }
}

function beautifyOrder(order: OrderModel): IOrderDbModel {
    const newOrder = {...order.getDbData()};

    delete newOrder.order_date;
    return newOrder;
}

export const ORDER_ITEMS_TABLE_SCHEMA: ITableSchema<any>[] = [
    ...GOOD_ITEMS_TABLE_SCHEMA_BASE.filter((item) => item.key !== 'id'),
    {
        key: 'serialNumber',
        title: textDictionary['orderItem.field.serialNumber']
    },
    {
        key: 'imei',
        title: textDictionary['orderItem.field.imei']
    }
];
