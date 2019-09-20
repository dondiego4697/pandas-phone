import {observable} from 'mobx';

interface IPage {
    url: string;
    title: string;
}
export class AdminPanelPageModel {
    @observable public pages: IPage[] = [
        {
            title: '[Витрина] iPhone',
            url: 'iphones'
        },
        {
            title: '[Витрина] AirPods',
            url: 'airpods'
        },
        {
            title: 'Заказы',
            url: 'orders'
        }
    ];
}
