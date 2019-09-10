import {observable, action, runInAction} from 'mobx';
import {Column} from 'material-table';

import {PageStatus} from 'admin/libs/types';
import {
    getAirpodsEnums,
    getAirpods,
    deleteAirpods,
    updateAirpods,
    insertAirpods
} from 'admin/libs/db-request';

export interface IAirpods {
    id: string;
    series: string;
    is_original: boolean;
    is_charging_case: boolean;
    price: number;
    discount: number;
    count: number;
}

interface ISnackbar {
    message: string;
    open: boolean;
}

export class AirpodsPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public limit = 10;
    @observable public offset = 0;
    @observable public data: IAirpods[] = [];
    @observable public tableColumns: Column<IAirpods>[] = [];
    @observable public snackbar: ISnackbar = {message: '', open: false};

    @action public setTableColumns(): Promise<any> {
        const makeLookup = (data: string[]) => {
            return data.reduce(
                (res: Record<string, string>, curr) => {
                    res[curr] = curr;
                    return res;
                },
                {}
            );
        };

        if (this.tableColumns.length === 0) {
            return getAirpodsEnums().then((enums) => {
                this.tableColumns = [
                    {
                        field: 'series',
                        lookup: makeLookup(enums.series),
                        title: 'Series'
                    },
                    {
                        field: 'is_original',
                        title: 'Original',
                        type: 'boolean'
                    },
                    {
                        field: 'is_charging_case',
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
                    },
                    {
                        field: 'count',
                        title: 'Count',
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
                getAirpods({limit: this.limit, offset: this.offset})
                    .then((data) => {
                        this.data = data;
                        this.status = PageStatus.DONE;
                    });
            });
        });
    }

    @action public deleteRow(airpods: IAirpods): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                deleteAirpods(airpods.id).then((deleted: IAirpods) => {
                    const index = this.data.findIndex((item) => item.id === deleted.id);
                    const buff = [...this.data];
                    buff.splice(index, 1);
                    this.data = buff;
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }

    @action public updateRow(airpods: IAirpods): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                const id = airpods.id;
                delete airpods.id;

                updateAirpods(id, airpods).then((updated: IAirpods) => {
                    const index = this.data.findIndex((item) => item.id === updated.id);
                    const buff = [...this.data];
                    buff.splice(index, 1, updated);
                    this.data = buff;
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }

    @action public insertRow(airpods: IAirpods): Promise<void> {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                insertAirpods(airpods).then((inserted: IAirpods) => {
                    this.data = [...this.data, inserted];
                    resolve();
                }).catch((err) => reject(err.response.data));
            });
        });
    }
}
