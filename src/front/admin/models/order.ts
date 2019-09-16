import {observable, action, runInAction} from 'mobx';
import {Column} from 'material-table';

import {PageStatus} from 'libs/types';
import {IOrder} from 'admin/models/orders';
import {IAirpod} from 'admin/models/airpods';
import {IIphone} from 'admin/models/iphones';

import {
    getOrder,
    getOrderItems,
    changeOrderStatus,
    insertAirpodOrder,
    insertIphoneOrder,
    deleteAirpodOrder,
    deleteIphoneOrder
} from 'admin/libs/db-request';

export interface IOrderItems {
    iphones: IIphone[];
    airpods: IAirpod[];
}

interface ISnackbar {
    message: string;
    open: boolean;
}

export class OrderPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public totalPrice = Number(0).toFixed(2);

    @observable public airpodsData: IAirpod[] = [];
    @observable public iphonesData: IIphone[] = [];

    @observable public tableAipodColumns: Column<IAirpod>[] = [];
    @observable public tableIphoneColumns: Column<IIphone>[] = [];

    @observable public orderData: IOrder | undefined;

    @observable public notFound = false;
    @observable public snackbar: ISnackbar = {message: '', open: false};

    @action public fetchData(orderId: string): void {
        runInAction(() => {
            this.status = PageStatus.LOADING;

            this.setMainData(orderId).then(() => {
                getOrderItems(orderId)
                    .then((data) => {
                        this.fillData(data);
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

    @action public handleActionResponse(orderId: string, promise: Promise<any>): Promise<void> {
        return new Promise((resolve, reject) => {
            promise
                .then(() => getOrderItems(orderId))
                .then((data) => {
                    this.fillData(data);
                    this.calcPrice();
                    resolve();
                })
                .catch((err) => reject(err.response.data))
                .finally(() => {
                    this.status = PageStatus.DONE;
                });
        });
    }

    @action public deleteAirpodRow(orderId: string, airpod: IAirpod): Promise<void> {
        return this.handleActionResponse(orderId, deleteAirpodOrder(orderId, airpod.id));
    }

    @action public deleteIphoneRow(orderId: string, iphone: IIphone): Promise<void> {
        return this.handleActionResponse(orderId, deleteIphoneOrder(orderId, iphone.id));
    }

    @action public insertAirpodRow(orderId: string, airpod: IAirpod): Promise<void> {
        return this.handleActionResponse(orderId, insertAirpodOrder(orderId, airpod.id));
    }

    @action public insertIphoneRow(orderId: string, iphone: IIphone): Promise<void> {
        return this.handleActionResponse(orderId, insertIphoneOrder(orderId, iphone.id));
    }

    @action private setMainData(orderId: string): Promise<void> {
        return getOrder(orderId).then((order) => {
            this.orderData = order;
        }).then(() => {
            this.tableAipodColumns = [
                {
                    editable: 'onAdd',
                    field: 'id',
                    title: 'ID'
                },
                {
                    editable: 'never',
                    field: 'series',
                    title: 'Series'
                },
                {
                    editable: 'never',
                    field: 'is_original',
                    title: 'Original',
                    type: 'boolean'
                },
                {
                    editable: 'never',
                    field: 'is_charging_case',
                    title: 'Charging case',
                    type: 'boolean'
                },
                {
                    editable: 'never',
                    field: 'price',
                    title: 'Price',
                    type: 'numeric'
                },
                {
                    editable: 'never',
                    field: 'discount',
                    title: 'Discount',
                    type: 'numeric'
                },
                {
                    editable: 'never',
                    field: 'serial_number',
                    title: 'Serial number'
                }
            ];

            this.tableIphoneColumns = [
                {
                    editable: 'onAdd',
                    field: 'id',
                    title: 'ID'
                },
                {
                    editable: 'never',
                    field: 'model',
                    title: 'Model'
                },
                {
                    editable: 'never',
                    field: 'color',
                    title: 'Color'
                },
                {
                    editable: 'never',
                    field: 'memory_capacity',
                    title: 'Memory capacity [GB]'
                },
                {
                    editable: 'never',
                    field: 'price',
                    title: 'Price',
                    type: 'numeric'
                },
                {
                    editable: 'never',
                    field: 'discount',
                    title: 'Discount',
                    type: 'numeric'
                },
                {
                    editable: 'never',
                    field: 'serial_number',
                    title: 'Serial number'
                },
                {
                    editable: 'never',
                    field: 'imei',
                    title: 'IMEI'
                }
            ];
        });
    }

    @action private fillData(data: IOrderItems): void {
        this.airpodsData = data.airpods;
        this.iphonesData = data.iphones;
    }

    @action private calcPrice(): void {
        const calcWithDiscount = (price: number, discount: number) => {
            return price * ((100 - discount) / 100);
        };

        let totalPrice = 0;
        this.airpodsData.forEach((airpod) => totalPrice += calcWithDiscount(airpod.price, airpod.discount));
        this.iphonesData.forEach((iphone) => totalPrice += calcWithDiscount(iphone.price, iphone.discount));

        this.totalPrice = totalPrice.toFixed(2);
    }
}
