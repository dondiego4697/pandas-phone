import {observable, action, runInAction} from 'mobx';

import {PageStatus} from 'admin/libs/types';
import {getGoodBrands, getGoodBrandsColumns} from 'admin/libs/db-request';

export interface GoodBrand {
    id: string;
    value: string;
}

export class GoodBrandPageModel {
    @observable status = PageStatus.LOADING;
    @observable limit = 10;
    @observable offset = 0;
    @observable data: GoodBrand[] = [];
    @observable tableColumns: string[] = [];

    constructor() {}

    @action setTableColumns(): Promise<string[]> {
        return new Promise((resolve) => {
            if (this.tableColumns.length > 0) {
                resolve();
            } else {
                getGoodBrandsColumns().then((columns) => {
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
                .then(() => getGoodBrands({limit: this.limit, offset: this.offset})
                .then((data) => {
                    this.data = data;
                    this.status = PageStatus.DONE;
                }));
        });
    }
}
