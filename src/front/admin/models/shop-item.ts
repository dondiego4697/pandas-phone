import {observable, action, runInAction} from 'mobx';
import {Column} from 'material-table';

import {PageStatus} from 'admin/libs/types';
import {
    getShopItems,
    deleteShopItem,
    updateShopItem,
    insertShopItem
} from 'admin/libs/db-request';

export interface ShopItem {
    id: string;
    good_pattern_id: string;
    price: number;
    discount?: number;
}

interface Snackbar {
    message: string;
    open: boolean;
}

export class ShopItemPageModel {
    @observable status = PageStatus.LOADING;
    @observable limit = 10;
    @observable offset = 0;
    @observable data: ShopItem[] = [];
    @observable tableColumns: Column<any>[] = [
        {
            title: 'ID',
            field: 'id',
            editable: 'never'
        },
        {
            title: 'Good pattern ID',
            field: 'good_pattern_id'
        },
        {
            title: 'Price',
            field: 'price',
            type: 'numeric'
        },
        {
            title: 'Discount [0-100]%',
            field: 'discount',
            type: 'numeric'
        }
    ];
    @observable snackbar: Snackbar = {message: '', open: false};

    constructor() {}

    @action fetchData() {
        runInAction(() => {
            this.status = PageStatus.LOADING;

            getShopItems({limit: this.limit, offset: this.offset})
                .then((data) => {
                    this.data = data;
                    this.status = PageStatus.DONE;
                });
        });
    }

    @action deleteRow(row: ShopItem): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                deleteShopItem(row.id).then((deleted: ShopItem) => {
                    const index = this.data.findIndex((item) => item.id === deleted.id);
                    const buff = [...this.data];
                    buff.splice(index, 1);

                    this.data = buff;
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }

    @action updateRow(row: ShopItem): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                const id = row.id;
                delete row.id;

                updateShopItem(id, row).then((updated: ShopItem) => {
                    const index = this.data.findIndex((item) => item.id === updated.id);
                    const buff = [...this.data];
                    buff.splice(index, 1, updated);

                    this.data = buff;
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }

    @action insertRow(row: ShopItem): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                insertShopItem(row).then((inserted: ShopItem) => {
                    const buff = [...this.data, inserted];
                    this.data = buff;
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }
}
