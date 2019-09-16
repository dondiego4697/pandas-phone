import {observable, action, runInAction} from 'mobx';

import {PageStatus} from 'libs/types';

export class MainPageModel {
    @observable public status = PageStatus.LOADING;

    @action public fetchData(): void {
        runInAction(() => {});
    }
}
