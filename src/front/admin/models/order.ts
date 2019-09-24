import {observable, action, runInAction} from 'mobx';
import {Column} from 'material-table';

import {PageStatus} from '@denstep/libs/types';
import {IOrder} from 'admin/models/orders';
import {IAirpodFull} from 'admin/models/airpods';
import {IIphoneFull} from 'admin/models/iphones';
import {makeLookup} from 'admin/libs/table-lookup';
import {getPriceWithDiscount, priceToString} from '@denstep/libs/get-price';

import {
    getOrder,
    getOrderItems,
    changeOrderStatus,
    insertAirpodOrder,
    insertIphoneOrder,
    deleteAirpodOrder,
    deleteIphoneOrder,
    updateAirpodOrder,
    updateIphoneOrder,
    getIphoneEnums,
    getAirpodsEnums
} from 'admin/libs/db-request';

export interface IOrderItems {
    iphones: IIphoneFull[];
    airpods: IAirpodFull[];
}

interface ISnackbar {
    message: string;
    open: boolean;
}

export class OrderPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public totalPrice = Number(0).toFixed(2);

    @observable public airpodsData: IAirpodFull[] = [];
    @observable public iphonesData: IIphoneFull[] = [];

    @observable public tableAipodColumns: Column<IAirpodFull>[] = [];
    @observable public tableIphoneColumns: Column<IIphoneFull>[] = [];

    @observable public orderData: IOrder | undefined;

    @observable public notFound = false;
    @observable public snackbar: ISnackbar = {message: '', open: false};

    @action public fetchData(orderId: string): void {
        runInAction(() => {
            this.status = PageStatus.LOADING;

            this.setMainData(orderId).then(() => {
                return getOrderItems(orderId)
                    .then((data) => {
                        this.fillData(data);
                        this.calcPrice();
                    });
            }).catch(() => {
                this.notFound = true;
            }).finally(() => {
                this.status = PageStatus.DONE;
            });
        });
    }

    @action public checkSerialNumbersFill(status: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (status === 'bought') {
                const airpodsWitoutSerial = this.airpodsData.some((airpod) => {
                    return !airpod.serial_number || airpod.serial_number.trim() === '';
                });
                const iphonesWitoutSerial = this.iphonesData.some((iphone) => {
                    return !iphone.serial_number || iphone.serial_number.trim() === '' ||
                        !iphone.imei || iphone.imei === '';
                });
                if (!airpodsWitoutSerial && !iphonesWitoutSerial) {
                    return resolve();
                }

                return reject({
                    response: {
                        data: {
                            error: 'Bad request',
                            message: 'fill all "SERIAL NUMBERS"',
                            statusCode: 400
                        }
                    }
                });
            }

            resolve();
        });
    }

    @action public updateStatus(orderId: string, status: 'bought' | 'reject' | 'called'): Promise<void> {
        return new Promise((resolve, reject) => {
            this.status = PageStatus.LOADING;
            runInAction(() => {
                this.checkSerialNumbersFill(status)
                    .then(() => changeOrderStatus(orderId, status))
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

    @action public deleteAirpodRow(orderId: string, airpod: IAirpodFull): Promise<void> {
        return this.handleActionResponse(orderId, deleteAirpodOrder(orderId, airpod.id));
    }

    @action public deleteIphoneRow(orderId: string, iphone: IIphoneFull): Promise<void> {
        return this.handleActionResponse(orderId, deleteIphoneOrder(orderId, iphone.id));
    }

    @action public insertAirpodRow(orderId: string, airpod: IAirpodFull): Promise<void> {
        return this.handleActionResponse(orderId, insertAirpodOrder(orderId, airpod));
    }

    @action public insertIphoneRow(orderId: string, iphone: IIphoneFull): Promise<void> {
        return this.handleActionResponse(orderId, insertIphoneOrder(orderId, iphone));
    }

    @action public updateAirpodRow(orderId: string, airpod: IAirpodFull): Promise<void> {
        return this.handleActionResponse(orderId, updateAirpodOrder(orderId, airpod));
    }

    @action public updateIphoneRow(orderId: string, iphone: IIphoneFull): Promise<void> {
        return this.handleActionResponse(orderId, updateIphoneOrder(orderId, iphone));
    }

    @action private setMainData(orderId: string): Promise<void> {
        return getOrder(orderId).then((order) => {
            this.orderData = order;
        }).then(() => {
            return Promise.all([getIphoneEnums(), getAirpodsEnums()]);
        }).then(([iphoneEnums, airpodsEnums]) => {
            this.tableAipodColumns = [
                {
                    editable: 'never',
                    field: 'id',
                    title: 'ID'
                },
                {
                    field: 'series',
                    lookup: makeLookup(airpodsEnums.series),
                    title: 'Серия'
                },
                {
                    field: 'original',
                    title: 'Оригинал',
                    type: 'boolean'
                },
                {
                    field: 'charging_case',
                    title: 'Заряжающий кейс',
                    type: 'boolean'
                },
                {
                    field: 'price',
                    title: 'Цена',
                    type: 'numeric'
                },
                {
                    field: 'discount',
                    title: 'Скидка',
                    type: 'numeric'
                },
                {
                    field: 'serial_number',
                    title: 'Серийный номер'
                }
            ];

            this.tableIphoneColumns = [
                {
                    editable: 'never',
                    field: 'id',
                    title: 'ID'
                },
                {
                    field: 'model',
                    lookup: makeLookup(iphoneEnums.models),
                    title: 'Модель'
                },
                {
                    field: 'color',
                    lookup: makeLookup(iphoneEnums.colors),
                    title: 'Цвет'
                },
                {
                    field: 'memory_capacity',
                    lookup: makeLookup(iphoneEnums.memories),
                    title: 'Объем памяти [GB]'
                },
                {
                    field: 'price',
                    title: 'Цена',
                    type: 'numeric'
                },
                {
                    field: 'discount',
                    title: 'Скидка',
                    type: 'numeric'
                },
                {
                    field: 'serial_number',
                    title: 'Серийный номер'
                },
                {
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
        let totalPrice = 0;
        this.airpodsData.forEach((airpod) => totalPrice += getPriceWithDiscount(airpod.price, airpod.discount));
        this.iphonesData.forEach((iphone) => totalPrice += getPriceWithDiscount(iphone.price, iphone.discount));

        this.totalPrice = priceToString(totalPrice);
    }
}
