import {observable, action, runInAction} from 'mobx';
import {Column} from 'material-table';

import {PageStatus} from 'admin/libs/types';
import {
    getGoodPatterns,
    deleteGoodPattern,
    updateGoodPattern,
    insertGoodPattern
} from 'admin/libs/db-request';

export interface GoodPattern {
    id: string;
    title?: string;
    description?: string;
    brand: string;
    product: string;
    model: string;
    color: string;
    category: string;
    memory_capacity?: string;
}

interface Snackbar {
    message: string;
    open: boolean;
}

export class GoodPatternPageModel {
    @observable status = PageStatus.LOADING;
    @observable limit = 10;
    @observable offset = 0;
    @observable data: GoodPattern[] = [];
    @observable tableColumns: Column<any>[] = [
        {
            title: 'ID',
            field: 'id',
            editable: 'never'
        },
        {
            title: 'Title',
            field: 'title'
        },
        {
            title: 'Description',
            field: 'description'
        },
        {
            title: 'Brand',
            field: 'brand'
        },
        {
            title: 'Product',
            field: 'product'
        },
        {
            title: 'Model',
            field: 'model'
        },
        {
            title: 'Color',
            field: 'color'
        },
        {
            title: 'Category',
            field: 'category'
        },
        {
            title: 'Memory capacity [GB]',
            field: 'memory_capacity',
            type: 'numeric'
        }
    ];
    @observable snackbar: Snackbar = {message: '', open: false};

    constructor() {}

    @action fetchData() {
        runInAction(() => {
            this.status = PageStatus.LOADING;

            getGoodPatterns({limit: this.limit, offset: this.offset})
                .then((data) => {
                    this.data = data;
                    this.status = PageStatus.DONE;
                });
        });
    }

    @action deleteRow(goodPattern: GoodPattern): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                deleteGoodPattern(goodPattern.id).then((deleted: GoodPattern) => {
                    const index = this.data.findIndex((item) => item.id === deleted.id);
                    const buff = [...this.data];
                    buff.splice(index, 1);

                    this.data = buff;
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }

    @action updateRow(goodPattern: GoodPattern): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                const id = goodPattern.id;
                delete goodPattern.id;

                updateGoodPattern(id, goodPattern).then((updated: GoodPattern) => {
                    const index = this.data.findIndex((item) => item.id === updated.id);
                    const buff = [...this.data];
                    buff.splice(index, 1, updated);

                    this.data = buff;
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }

    @action insertRow(goodPattern: GoodPattern): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                insertGoodPattern(goodPattern).then((inserted: GoodPattern) => {
                    const buff = [...this.data, inserted];
                    this.data = buff;

                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }
}
