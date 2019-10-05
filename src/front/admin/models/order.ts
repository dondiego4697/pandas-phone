import {observable, action, runInAction} from 'mobx';

import {PageStatus} from '@denstep-core/libs/types';
import {AdminRequest, IOrder, IOrderItem, IOrderItemFull} from '@denstep-core/libs/api-requests';
import {ITableSchema} from '@denstep-core/components/table';
import {getPriceWithDiscount, priceToString} from '@denstep-core/libs/get-price';
import {GOOD_ITEMS_TABLE_SCHEMA as GOOD_ITEMS_TABLE_SCHEMA_BASE} from 'admin/models/good-items';

const DEFAULT_ORDER = {
    customer_name: '',
    customer_phone: ''
} as IOrder;

const NEW_ID = 'new';

export class OrderPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public order = DEFAULT_ORDER;
    @observable public orderItems: IOrderItemFull[] = [];
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
                    this.order = order;
                    this.orderItems = orderItems;
                    this.calcTotalPrice();
                })
                .catch(reject)
                .finally(() => {
                    this.status = PageStatus.DONE;
                });
            });
        });
    }

    @action public deleteOrderItem(id: string): Promise<IOrderItem> {
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

    @action public updateOrder(): Promise<IOrder> {
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

    @action public resolveOrder(id: string): Promise<IOrder> {
        this.status = PageStatus.LOADING;
        return AdminRequest
            .resolveOrder(id)
            .finally(() => {
                this.status = PageStatus.DONE;
            });
    }

    @action public rejectOrder(id: string): Promise<IOrder> {
        this.status = PageStatus.LOADING;

        return AdminRequest
            .rejectOrder(id)
            .finally(() => {
                this.status = PageStatus.DONE;
            });
    }

    @action public calcTotalPrice(): void {
        const totalPrice = this.orderItems.reduce(
            (result, order) => result + getPriceWithDiscount(order.price, order.discount),
            0
        );

        this.totalPrice = priceToString(totalPrice);
    }
}

function beautifyOrder(order: IOrder): IOrder {
    const newOrder = {...order};

    delete newOrder.order_date;
    return newOrder;
}

export const ORDER_ITEMS_TABLE_SCHEMA: ITableSchema[] = [
    ...GOOD_ITEMS_TABLE_SCHEMA_BASE.filter((item) => item.key !== 'id'),
    {
        key: 'serial_number',
        title: 'Serial number'
    },
    {
        key: 'imei',
        title: 'IMEI'
    }
];
