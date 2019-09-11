import {observable, action, runInAction} from 'mobx';
import {Column} from 'material-table';

import {PageStatus} from 'admin/libs/types';
import {IOrder} from 'admin/models/orders';

import {
    getOrderItems,
    deleteOrderItem,
    insertOrderItem,
    updateOrderItem,
    getOrderEnums,
    getOrder,
    changeOrderStatus,
    IOrderEnums
} from 'admin/libs/db-request';

export interface IOrderItem {
    id: string;
    order_id: string;
    serial_number: string;
    imei: string;
    price: number;
    discount: number;
    good_type: string;
    good_id: string;
}

interface ISnackbar {
    message: string;
    open: boolean;
}

export class OrderPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public totalPrice = Number(0).toFixed(2);
    @observable public data: IOrderItem[] = [];
    @observable public orderData: IOrder | undefined;
    @observable public notFound = false;
    @observable public tableColumns: Column<IOrderItem>[] = [];
    @observable public snackbar: ISnackbar = {message: '', open: false};

    @action public fetchData(orderId: string): void {
        runInAction(() => {
            this.status = PageStatus.LOADING;

            this.setMainData(orderId).then(() => {
                getOrderItems(orderId)
                    .then((data) => {
                        this.data = data;
                        this.calcPrice();

                        this.status = PageStatus.DONE;
                    });
            }).catch(() => {
                this.notFound = true;
                this.status = PageStatus.DONE;
            });
        });
    }

    @action public updateStatus(orderId: string, status: 'bought' | 'reject' | 'called'): Promise<void> {
        return new Promise((resolve, reject) => {
            this.status = PageStatus.LOADING;
            runInAction(() => {
                changeOrderStatus(orderId, status)
                    .then(() => resolve())
                    .catch((err) => {
                        reject(err.response.data);
                    }).finally(() => {
                        this.status = PageStatus.DONE;
                    });
            });
        });
    }

    @action public deleteRow(orderItem: IOrderItem): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                deleteOrderItem(orderItem.id).then((deleted: IOrderItem) => {
                    const index = this.data.findIndex((item) => item.id === deleted.id);
                    const buff = [...this.data];
                    buff.splice(index, 1);
                    this.data = buff;

                    this.calcPrice();
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }

    @action public updateRow(orderItem: IOrderItem): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                const id = orderItem.id;
                delete orderItem.id;

                updateOrderItem(id, orderItem).then((updated: IOrderItem) => {
                    const index = this.data.findIndex((item) => item.id === updated.id);
                    const buff = [...this.data];
                    buff.splice(index, 1, updated);
                    this.data = buff;

                    this.calcPrice();
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }

    @action public insertRow(orderId: string, orderItem: IOrderItem): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                orderItem.order_id = orderId;
                insertOrderItem(orderItem).then((inserted: IOrderItem) => {
                    this.data = [...this.data, inserted];

                    this.calcPrice();
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }

    @action private setMainData(orderId: string): Promise<void> {
        const makeLookup = (data: string[]) => {
            return data.reduce(
                (res: Record<string, string>, curr) => {
                    res[curr] = curr;
                    return res;
                },
                {}
            );
        };

        return Promise.all([
            this.tableColumns.length === 0 ? getOrderEnums().then((enums) => {
                this.tableColumns = [
                    {
                        editable: 'onAdd',
                        field: 'good_type',
                        lookup: makeLookup(enums.good_types),
                        title: 'Type'
                    },
                    {
                        editable: 'onAdd',
                        field: 'good_id',
                        title: 'Good ID'
                    },
                    {
                        field: 'serial_number',
                        title: 'Serial'
                    },
                    {
                        field: 'imei',
                        title: 'IMEI'
                    },
                    {
                        field: 'price',
                        title: 'Price',
                        type: 'numeric'
                    },
                    {
                        field: 'discount',
                        title: 'Discount',
                        type: 'numeric'
                    }
                ];
            }) : Promise.resolve(),
            getOrder(orderId)
        ]).then(([_, order]) => {
            this.orderData = order;
        });
    }

    @action private calcPrice(): void {
        this.totalPrice = (this.data.reduce(
            (res, item) => {
                return res + item.price * ((100 - item.discount) / 100);
            },
            0
        )).toFixed(2);
    }
}
