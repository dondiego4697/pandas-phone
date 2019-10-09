import {observable, action, runInAction} from 'mobx';

import {PageStatus} from '@denstep-core/libs/types';
import {OrderItemModel, IOrderItemDbModel} from 'common/models/order-item';
import {AdminRequest} from 'common/libs/api-requests';

const DEFAULT_ORDER_ITEM = new OrderItemModel({
    id: '',
    good_item_id: '',
    imei: '',
    order_id: '',
    serial_number: ''
});

const NEW_ID = 'new';

export class OrderItemPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public orderItem = DEFAULT_ORDER_ITEM;
    @observable public isNewOrderItem = true;

    @action public fetchData(orderItemId: string): Promise<void> {
        this.isNewOrderItem = orderItemId === NEW_ID;

        return new Promise((resolve, reject) => {
            runInAction(() => {
                this.status = PageStatus.LOADING;

                if (this.isNewOrderItem) {
                    this.status = PageStatus.DONE;
                    resolve();
                    return;
                }

                AdminRequest.getOrderItem(orderItemId)
                    .then((data) => {
                        this.orderItem = new OrderItemModel({
                            ...data.orderItem,
                            imei: data.orderItem.imei || DEFAULT_ORDER_ITEM.imei,
                            serial_number: data.orderItem.serial_number || DEFAULT_ORDER_ITEM.serialNumber
                        });
                        this.status = PageStatus.DONE;
                    })
                    .catch(reject);
            });
        });
    }

    @action public clearData(): void {
        this.orderItem = DEFAULT_ORDER_ITEM;
    }

    @action public updateOrderItem(orderId: string): Promise<IOrderItemDbModel> {
        this.status = PageStatus.LOADING;

        if (this.isNewOrderItem) {
            return AdminRequest
                .createOrderItem(orderId, beautifyOrderItem(this.orderItem))
                .finally(() => {
                    this.status = PageStatus.DONE;
                });
        }

        return AdminRequest
            .updateOrderItem(beautifyOrderItem(this.orderItem))
            .finally(() => {
                this.status = PageStatus.DONE;
            });
    }
}

function beautifyOrderItem(orderItem: OrderItemModel): IOrderItemDbModel {
    const newOrderItem = {...orderItem.getDbData()};

    if (!orderItem.serialNumber) {
        newOrderItem.serial_number = null;
    }

    if (!orderItem.imei) {
        newOrderItem.imei = null;
    }

    return newOrderItem;
}
