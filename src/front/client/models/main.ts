import {observable, action, runInAction} from 'mobx';

import {PageStatus} from 'libs/types';
import {getBarItems} from 'client/libs/request';
import {ClientCookie} from 'client/libs/cookie';

export interface IAirpod {
    id: string;
    series: string;
    original: boolean;
    charging: boolean;
    price: number;
    discount: number;
}

export interface IIphone {
    id: string;
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
    @observable public cartCount = 0;
    @observable public showAddedToCartPopup = false;

    @action public fetchData(): void {
        runInAction(() => {
            this.calcCartCount();

            getBarItems().then((barItems) => {
                this.barItems = barItems;
                this.status = PageStatus.DONE;
            });
        });
    }

    @action public calcCartCount(): void {
        const iphones = ClientCookie.getCartIds('iphone');
        const airpods = ClientCookie.getCartIds('airpod');
        this.cartCount = iphones.length + airpods.length;
    }
}
