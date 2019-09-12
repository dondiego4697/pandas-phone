import {observable} from 'mobx';

interface IPage {
    url: string;
    title: string;
}
export class AdminPanelPageModel {
    @observable public pages: IPage[] = [
        {
            title: 'iPhones',
            url: 'iphones'
        },
        {
            title: 'AirPods',
            url: 'airpods'
        },
        {
            title: 'Orders',
            url: 'orders'
        }
    ];
}
