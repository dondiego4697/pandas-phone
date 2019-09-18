import {observable, action, runInAction} from 'mobx';

import {PageStatus} from 'libs/types';
import {getBarItems} from 'client/libs/request';
import {ClientCookie} from 'client/libs/cookie';
import {IAirpod, IIphone} from 'client/models/main';

interface IData {
    airpods: IAirpod[];
    iphones: IIphone[];
}

export class CartPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public showAddedToCartPopup = false;
    @observable public data: IData = {airpods: [], iphones: []};

    @action public fetchData(): void {
        runInAction(() => {
            this.status = PageStatus.LOADING;
            getBarItems().then((barItems) => {
                const iphonesIds = ClientCookie.getCartIds('iphone');
                const airpodsIds = ClientCookie.getCartIds('airpod');

                const airpods = airpodsIds
                    .map((id) => barItems.airpods.find((airpod) => airpod.id === id))
                    .filter(Boolean) as IAirpod[];
                const iphones = iphonesIds
                    .map((id) => barItems.iphones.find((iphone) => iphone.id === id))
                    .filter(Boolean) as IIphone[];

                this.data = {airpods, iphones};
                this.status = PageStatus.DONE;
            });
        });
    }
}
