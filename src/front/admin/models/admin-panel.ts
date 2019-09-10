import {observable} from 'mobx';

export class AdminPanelPageModel {
    @observable public tables: string[] = [
        'iphone',
        'airpods',
        'order'
    ];
}
