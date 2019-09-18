import {observable, action, runInAction} from 'mobx';
import {Column} from 'material-table';

import {PageStatus} from 'libs/types';
import {makeLookup} from 'admin/libs/table-lookup';
import {
    getIphoneEnums,
    getIphonesBar,
    insertIphoneBar,
    updateIphoneBar,
    deleteIphoneBar
} from 'admin/libs/db-request';

export interface IIphone {
    id: string;
    model: string;
    color: string;
    memory_capacity: string;
    price: number;
    discount: number;
}

export interface IIphoneFull extends IIphone {
    serial_number: string;
    imei: string;
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
                getIphonesBar({limit: this.limit, offset: this.offset})
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
                deleteIphoneBar(iphone.id).then((deleted: IIphone) => {
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

                updateIphoneBar(id, iphone).then((updated: IIphone) => {
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
                insertIphoneBar(iphone).then((inserted: IIphone) => {
                    this.data = [...this.data, inserted];
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }
}
