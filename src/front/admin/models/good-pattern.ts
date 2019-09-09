import {observable, action, runInAction} from 'mobx';

import {PageStatus} from 'admin/libs/types';
import {
    getGoodPatterns,
    getGoodPatternsColumns,
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
    @observable tableColumns: string[] = [];
    @observable snackbar: Snackbar = {message: '', open: false};

    constructor() {}

    @action setTableColumns(): Promise<string[]> {
        return new Promise((resolve) => {
            if (this.tableColumns.length > 0) {
                resolve();
            } else {
                getGoodPatternsColumns().then((columns) => {
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
                .then(() => getGoodPatterns({limit: this.limit, offset: this.offset})
                .then((data) => {
                    this.data = data;
                    this.status = PageStatus.DONE;
                }));
        });
    }

    @action deleteRow(row: GoodPattern): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                deleteGoodPattern(row.id).then((deletedGoodPattern: GoodPattern) => {
                    const index = this.data.findIndex((goodPattern) => goodPattern.id === deletedGoodPattern.id);
                    const buff = [...this.data];
                    buff.splice(index, 1);

                    this.data = buff;
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }

    @action updateRow(row: GoodPattern): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                const id = row.id;
                delete row.id;

                updateGoodPattern(id, row).then((updatedGoodPattern: GoodPattern) => {
                    const index = this.data.findIndex((goodPattern) => goodPattern.id === updatedGoodPattern.id);
                    const buff = [...this.data];
                    buff.splice(index, 1, updatedGoodPattern);

                    this.data = buff;
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }

    @action insertRow(row: GoodPattern): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                insertGoodPattern(row).then((insertedGoodPattern: GoodPattern) => {
                    const buff = [...this.data, insertedGoodPattern];
                    this.data = buff;
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }
}
