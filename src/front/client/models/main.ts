import {observable, action, runInAction} from 'mobx';

import {PageStatus} from '@denstep-core/libs/types';

export class MainPageModel {
    @observable public status = PageStatus.LOADING;

    @action public fetchData(): void {
        runInAction(() => {
            this.status = PageStatus.LOADING;
            this.status = PageStatus.DONE;
        });
    }
}
