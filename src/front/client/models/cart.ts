import {observable, action, runInAction} from 'mobx';
import {PhoneNumberFormat as PNF, PhoneNumberUtil} from 'google-libphonenumber';

import {PageStatus} from 'libs/types';
import {getBarItems, addOrder} from 'client/libs/request';
import {ClientCookie} from 'client/libs/cookie';
import {IAirpod, IIphone, IBarItems} from 'client/models/main';
import {getPriceWithDiscount, priceToString} from 'libs/get-price';

const phoneUtil = PhoneNumberUtil.getInstance();

interface IData {
    airpods: IAirpod[];
    iphones: IIphone[];
}

interface ICustomerData {
    name: string;
    phone: string;
}

export class CartPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public transparentProgressLock = false;

    @observable public showAddOrderErrorPopup = false;
    @observable public showAddOrderSuccessPopup = false;

    @observable public totalPrice = '0';
    @observable public cartCount = 0;
    @observable public data: IData = {airpods: [], iphones: []};
    @observable public customerData: ICustomerData = {name: '', phone: ''};
    @observable public customerError: ICustomerData = {name: '', phone: ''};
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

    @observable public addOrder(): Promise<void> {
        const airpodIds = ClientCookie.getCartIds('airpod');
        const iphoneIds = ClientCookie.getCartIds('iphone');

        this.status = PageStatus.LOADING;

        return addOrder(
            this.customerData.name,
            this.customerData.phone,
            airpodIds,
            iphoneIds
        ).finally(() => {
            this.status = PageStatus.DONE;
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

    @action public resetCookie(): void {
        ClientCookie.clearCart();
    }

    @action public resetCustomerData(): void {
        this.customerData = {name: '', phone: ''};
    }

    @action public setCustomerName(name: string): void {
        this.customerData = {
            ...this.customerData,
            name
        };
    }

    @action public setCustomerPhone(rawValue: string): void {
        let value = rawValue.replace(/[^\+0-9]/gim, '');
        if (value.length <= 1 && value !== '+') {
            this.customerData = {
                ...this.customerData,
                phone: `+${value}`
            };
            return;
        }
        try {
            const number = phoneUtil.parse(value, 'RU');
            value = phoneUtil.format(number, PNF.INTERNATIONAL);
            // tslint:disable-next-line
        } catch (_) {} finally {
            this.customerData = {
                ...this.customerData,
                phone: value
            };
        }
    }

    @action public validateCustomerData(): boolean {
        let isOk = true;
        const newCustomerError = {phone: '', name: ''};

        try {
            const number = phoneUtil.parse(this.customerData.phone, 'RU');
            if (!phoneUtil.isValidNumber(number)) {
                newCustomerError.phone = 'Невалидный номер';
                isOk = false;
            }
        } catch (_) {
            newCustomerError.phone = 'Невалидный номер';
            isOk = false;
        }

        if (this.customerData.name.trim() === '') {
            newCustomerError.name = 'Имя не может быть пустым';
            isOk = false;
        }

        this.customerError = newCustomerError;
        return isOk;
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
