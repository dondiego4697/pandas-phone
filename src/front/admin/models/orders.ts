import {observable, action, runInAction} from 'mobx';
import {Column} from 'material-table';

import {PageStatus} from 'admin/libs/types';
import {
    getOpendOrders,
    updateOrder
} from 'admin/libs/db-request';

export interface IOrder {
    id: string;
    customer_name: string;
    customer_phone: string;
    status: string;
    order_date: string;
    sold_data: string;
}

interface ISnackbar {
    message: string;
    open: boolean;
}

export class OrdersPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public limit = 10;
    @observable public offset = 0;
    @observable public data: IOrder[] = [];
    @observable public tableColumns: Column<IOrder>[] = [];
    @observable public snackbar: ISnackbar = {message: '', open: false};

    @action public setTableColumns(): Promise<void> {
        if (this.tableColumns.length === 0) {
            this.tableColumns = [
                {
                    field: 'customer_name',
                    title: 'Customer name'
                },
                {
                    editable: 'never',
                    field: 'customer_phone',
                    title: 'Customer phone'
                },
                {
                    editable: 'never',
                    field: 'status',
                    title: 'Status'
                },
                {
                    editable: 'never',
                    field: 'order_date',
                    title: 'Order date'
                }
            ];
        }

        return Promise.resolve();
    }

    @action public fetchData(): void {
        runInAction(() => {
            this.status = PageStatus.LOADING;

            this.setTableColumns().then(() => {
                getOpendOrders({limit: this.limit, offset: this.offset})
                    .then((data) => {
                        this.data = data;
                        this.status = PageStatus.DONE;
                    });
            });
        });
    }

    @action public updateRow(order: IOrder): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                const id = order.id;
                delete order.id;

                updateOrder(id, order).then((updated: IOrder) => {
                    const index = this.data.findIndex((item) => item.id === updated.id);
                    const buff = [...this.data];
                    buff.splice(index, 1, updated);
                    this.data = buff;

                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }
}
