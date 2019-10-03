import {observable} from 'mobx';

interface IPage {
    path: string;
    title: string;
}
export class AdminPanelPageModel {
    @observable public pages: IPage[] = [
        {
            path: '/bender-root/good-items',
            title: 'Good items'
        },
        {
            path: '/bender-root/orders',
            title: 'Orders'
        }
    ];
}
