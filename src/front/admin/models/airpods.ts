import {observable, action, runInAction} from 'mobx';
import {Column} from 'material-table';

import {PageStatus} from 'libs/types';
import {makeLookup} from 'admin/libs/table-lookup';
import {
    getAirpodsEnums,
    getAirpodsBar,
    deleteAirpodBar,
    updateAirpodBar,
    insertAirpodBar
} from 'admin/libs/db-request';

export interface IAirpod {
    id: string;
    series: string;
    original: boolean;
    charging_case: boolean;
    price: number;
    discount: number;
}

export interface IAirpodFull extends IAirpod {
    serial_number: string;
}

interface ISnackbar {
    message: string;
    open: boolean;
}

export class AirpodsPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public limit = 10;
    @observable public offset = 0;
    @observable public data: IAirpod[] = [];
    @observable public tableColumns: Column<IAirpod>[] = [];
    @observable public snackbar: ISnackbar = {message: '', open: false};

    @action public setTableColumns(): Promise<any> {
        if (this.tableColumns.length === 0) {
            return getAirpodsEnums().then((enums) => {
                this.tableColumns = [
                    {
                        field: 'series',
                        lookup: makeLookup(enums.series),
                        title: 'Series'
                    },
                    {
                        field: 'original',
                        title: 'Original',
                        type: 'boolean'
                    },
                    {
                        field: 'charging_case',
                        title: 'Charging case',
                        type: 'boolean'
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
                getAirpodsBar({limit: this.limit, offset: this.offset})
                    .then((data) => {
                        this.data = data;
                        this.status = PageStatus.DONE;
                    });
            });
        });
    }

    @action public deleteRow(airpod: IAirpod): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                deleteAirpodBar(airpod.id).then((deleted: IAirpod) => {
                    const index = this.data.findIndex((item) => item.id === deleted.id);
                    const buff = [...this.data];
                    buff.splice(index, 1);
                    this.data = buff;
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }

    @action public updateRow(airpod: IAirpod): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                const id = airpod.id;
                delete airpod.id;

                updateAirpodBar(id, airpod).then((updated: IAirpod) => {
                    const index = this.data.findIndex((item) => item.id === updated.id);
                    const buff = [...this.data];
                    buff.splice(index, 1, updated);
                    this.data = buff;
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }

    @action public insertRow(airpod: IAirpod): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                insertAirpodBar(airpod).then((inserted: IAirpod) => {
                    this.data = [...this.data, inserted];
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }
}
