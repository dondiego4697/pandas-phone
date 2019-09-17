import {observable, action, runInAction} from 'mobx';
import {Column} from 'material-table';

import {PageStatus} from 'libs/types';
import {makeLookup} from 'admin/libs/table-lookup';
import {
    getIphoneEnums,
    getIphones,
    insertIphone,
    updateIphone,
    deleteIphone
} from 'admin/libs/db-request';

export interface IIphone {
    id: string;
    model: string;
    color: string;
    memory_capacity: string;
    price: number;
    discount: number;
    serial_number: string;
    imei: string;
    is_sold: boolean;
    is_bar: boolean;
}

interface ISnackbar {
    message: string;
    open: boolean;
}

export class IphonesPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public limit = 10;
    @observable public offset = 0;
    @observable public data: IIphone[] = [];
    @observable public tableColumns: Column<IIphone>[] = [];
    @observable public snackbar: ISnackbar = {message: '', open: false};

    @action public setTableColumns(): Promise<void> {
        if (this.tableColumns.length === 0) {
            return getIphoneEnums().then((enums) => {
                this.tableColumns = [
                    {
                        editable: 'never',
                        field: 'id',
                        title: 'ID'
                    },
                    {
                        field: 'model',
                        lookup: makeLookup(enums.models),
                        title: 'Model'
                    },
                    {
                        field: 'color',
                        lookup: makeLookup(enums.colors),
                        title: 'Color'
                    },
                    {
                        field: 'memory_capacity',
                        lookup: makeLookup(enums.memories),
                        title: 'Memory capacity [GB]'
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
                    },
                    {
                        editable: 'onUpdate',
                        field: 'serial_number',
                        title: 'Serial number'
                    },
                    {
                        editable: 'onUpdate',
                        field: 'imei',
                        title: 'IMEI'
                    },
                    {
                        editable: 'never',
                        field: 'is_bar',
                        title: 'Bar',
                        type: 'boolean'
                    }
                ];
            });
        }

        return Promise.resolve();
    }

    @action public fetchData(): void {
        runInAction(() => {
            this.status = PageStatus.LOADING;

            this.setTableColumns().then(() => {
                getIphones({limit: this.limit, offset: this.offset})
                    .then((data) => {
                        this.data = data;
                        this.status = PageStatus.DONE;
                    });
            });
        });
    }

    @action public deleteRow(iphone: IIphone): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                deleteIphone(iphone.id).then((deleted: IIphone) => {
                    const index = this.data.findIndex((item) => item.id === deleted.id);
                    const buff = [...this.data];
                    buff.splice(index, 1);
                    this.data = buff;
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }

    @action public updateRow(iphone: IIphone): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                const id = iphone.id;
                delete iphone.id;

                updateIphone(id, iphone).then((updated: IIphone) => {
                    const index = this.data.findIndex((item) => item.id === updated.id);
                    const buff = [...this.data];
                    buff.splice(index, 1, updated);
                    this.data = buff;
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }

    @action public insertRow(iphone: IIphone): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                iphone.is_bar = true;
                insertIphone(iphone).then((inserted: IIphone) => {

                    this.data = [...this.data, inserted];
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }
}
