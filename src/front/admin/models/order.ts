import {observable, action, runInAction} from 'mobx';

import {PageStatus} from 'admin/libs/types';
import {getOrders, getOrdersColumns} from 'admin/libs/db-request';

export interface Order {
    // id: string;
    // value: string;
}

export class OrderPageModel {
    @observable status = PageStatus.LOADING;
    @observable limit = 10;
    @observable offset = 0;
    @observable data: Order[] = [];
    @observable tableColumns: string[] = [];

    constructor() {}

    @action setTableColumns(): Promise<string[]> {
        return new Promise((resolve) => {
            if (this.tableColumns.length > 0) {
                resolve();
            } else {
                getOrdersColumns().then((columns) => {
                    this.tableColumns = columns;
                    resolve();
                });
            }
        });
    }

    @action fetchData() {
        runInAction(() => {
            this.status = PageStatus.LOADING;
            this.setTableColumns()
                .then(() => getOrders({limit: this.limit, offset: this.offset})
                .then((data) => {
                    this.data = data;
                    this.status = PageStatus.DONE;
                }));
        });
    }
}
