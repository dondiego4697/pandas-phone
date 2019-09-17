import {observable, action, runInAction} from 'mobx';

import {PageStatus} from 'libs/types';
import {getBarItems} from 'client/libs/request';

export interface IAirpod {
    series: string;
    original: boolean;
    charging: boolean;
    price: number;
    discount: number;
}

export interface IIphone {
    model: string;
    color: string;
    memory: string;
    price: number;
    discount: number;
}

export interface IBarItems {
    airpods: IAirpod[];
    iphones: IIphone[];
}

export class MainPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public barItems: IBarItems | undefined;

    @action public fetchData(): void {
        runInAction(() => {
            getBarItems().then((barItems) => {
                console.log(barItems)
                this.barItems = barItems;
                this.status = PageStatus.DONE;
            });
        });
    }
}
