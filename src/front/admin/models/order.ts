import {observable, action, runInAction} from 'mobx';
import {Column} from 'material-table';

import {PageStatus} from 'admin/libs/types';
import {getOrders, updateOrder} from 'admin/libs/db-request';

export interface Order {
    id: string;
    good_pattern_id: string;
    serial_number?: string;
    imei?: string;
    price: number;
    discount?: number;

    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    is_called: boolean;

    order_date: string;
    sold_date: string;
}

interface Snackbar {
    message: string;
    open: boolean;
}

export class OrderPageModel {
    @observable status = PageStatus.LOADING;
    @observable limit = 10;
    @observable offset = 0;
    @observable data: Order[] = [];
    @observable tableColumns: Column<any>[] = [
        {
            title: 'ID',
            field: 'id',
            editable: 'never'
        },
        {
            title: 'Good pattern id',
            field: 'good_pattern_id'
        },
        {
            title: 'Serial number',
            field: 'serial_number'
        },
        {
            title: 'IMEI',
            field: 'imei'
        },
        {
            title: 'Price',
            field: 'price',
            type: 'numeric'
        },
        {
            title: 'Discount',
            field: 'discount',
            type: 'numeric'
        },
        {
            title: 'Customer name',
            field: 'customer_name'
        },
        {
            title: 'Customer email',
            field: 'customer_email'
        },
        {
            title: 'Customer phone',
            field: 'customer_phone'
        },
        {
            title: 'Is called',
            field: 'is_called',
            type: 'boolean'
        },
        {
            title: 'Order date',
            field: 'order_date',
            type: 'datetime',
            editable: 'never'
        },
    ];
    @observable snackbar: Snackbar = {message: '', open: false};

    constructor() {}

    @action fetchData() {
        runInAction(() => {
            this.status = PageStatus.LOADING;

            getOrders({limit: this.limit, offset: this.offset})
                .then((data) => {
                    this.data = data;
                    this.status = PageStatus.DONE;
                });
        });
    }

    @action updateRow(row: Order): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                const id = row.id;
                delete row.id;

                updateOrder(id, row).then((updated: Order) => {
                    const index = this.data.findIndex((item) => item.id === updated.id);
                    const buff = [...this.data];
                    buff.splice(index, 1, updated);

                    this.data = buff;
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }

    @action sell(row: Order) {
        runInAction(() => {
            this.status = PageStatus.LOADING;
            const id = row.id;
            delete row.id;

            row.sold_date = 'now()';

            updateOrder(id, row).then(() => this.fetchData());
        });
    }
}
