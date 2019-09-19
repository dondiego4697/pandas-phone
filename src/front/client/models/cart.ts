import {observable, action, runInAction} from 'mobx';

import {PageStatus} from 'libs/types';
import {getBarItems} from 'client/libs/request';
import {ClientCookie} from 'client/libs/cookie';
import {IAirpod, IIphone, IBarItems} from 'client/models/main';
import {getPriceWithDiscount, priceToString} from 'libs/get-price';

interface IData {
    airpods: IAirpod[];
    iphones: IIphone[];
}

export class CartPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public showAddedToCartPopup = false;
    @observable public totalPrice = '0';
    @observable public cartCount = 0;
    @observable public data: IData = {airpods: [], iphones: []};
    @observable private barItems: IBarItems | undefined;

    @action public fetchData(): void {
        runInAction(() => {
            this.status = PageStatus.LOADING;
            getBarItems().then((barItems) => {
                this.barItems = barItems;
                this.recalcData();
                this.status = PageStatus.DONE;
            });
        });
    }

    @action public removeIphone(iphone: IIphone): void {
        ClientCookie.removeIdFromCart('iphone', iphone.id);
        this.recalcData();
    }

    @action public removeAirpod(airpod: IAirpod): void {
        ClientCookie.removeIdFromCart('airpod', airpod.id);
        this.recalcData();
    }

    @action private recalcData(): void {
        const iphonesIds = ClientCookie.getCartIds('iphone');
        const airpodsIds = ClientCookie.getCartIds('airpod');

        const airpods = airpodsIds
            .map((id) => this.barItems!.airpods.find((airpod) => airpod.id === id))
            .filter(Boolean) as IAirpod[];
        const iphones = iphonesIds
            .map((id) => this.barItems!.iphones.find((iphone) => iphone.id === id))
            .filter(Boolean) as IIphone[];

        this.data = {airpods, iphones};

        this.cartCount = iphones.length + airpods.length;
        this.calcPrice();
    }

    @action private calcPrice(): void {
        let totalPrice = 0;
        this.data.airpods.forEach((airpod) => totalPrice += getPriceWithDiscount(airpod.price, airpod.discount));
        this.data.iphones.forEach((iphone) => totalPrice += getPriceWithDiscount(iphone.price, iphone.discount));

        this.totalPrice = priceToString(totalPrice);
    }
}
