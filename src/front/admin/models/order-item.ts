import {observable, action, runInAction} from 'mobx';

import {PageStatus} from '@denstep-core/libs/types';
import {AdminRequest, IOrderItem} from '@denstep-core/libs/api-requests';

const DEFAULT_ORDER_ITEM = {
    good_item_id: '',
    imei: '',
    order_item_id: '',
    serial_number: ''
} as IOrderItem;

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
                        this.orderItem = {
                            ...data,
                            imei: data.imei || DEFAULT_ORDER_ITEM.imei,
                            serial_number: data.serial_number || DEFAULT_ORDER_ITEM.serial_number
                        };
                        this.status = PageStatus.DONE;
                    })
                    .catch(reject);
            });
        });
    }

    @action public clearData(): void {
        this.orderItem = DEFAULT_ORDER_ITEM;
    }

    @action public updateOrderItem(orderId: string): Promise<IOrderItem> {
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

function beautifyOrderItem(orderItem: IOrderItem): IOrderItem {
    const newOrderItem = {...orderItem};
    if (!newOrderItem.serial_number) {
        newOrderItem.serial_number = null;
    }

    if (!newOrderItem.imei) {
        newOrderItem.imei = null;
    }

    return newOrderItem;
}
