import {observable} from 'mobx';

interface IPage {
    path: string;
    title: string;
}
export class AdminPanelPageModel {
    @observable public pages: IPage[] = [
        {
            path: '/good-items',
            title: 'Товары'
        },
        {
            path: '/orders',
            title: 'Заказы'
        }
    ];
}
