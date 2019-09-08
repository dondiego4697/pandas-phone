import {observable, action, runInAction} from 'mobx';

import {PageStatus} from 'admin/libs/types';
import {getTables} from 'admin/libs/db-request';

export class AdminPanelPageModel {
    @observable status = PageStatus.LOADING;
    @observable tables: string[] = [];

    constructor() {}

    @action fetchTables() {
        runInAction(() => {
            getTables().then((tables) => {
                this.tables = tables;
                this.status = PageStatus.DONE;
            });
        });
    }
}
