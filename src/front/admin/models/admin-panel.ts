import {observable} from 'mobx';

export class AdminPanelPageModel {
    @observable public pages: string[] = [
        'iphone',
        'airpods',
        'order'
    ];
}
