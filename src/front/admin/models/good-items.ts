import {observable, action, runInAction} from 'mobx';

import {PageStatus} from '@denstep-core/libs/types';
import {AdminRequest} from '@denstep-core/libs/api-requests';

export class GoodItemsPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public limit = 10;
    @observable public offset = 0;

    @action public fetchData(): void {
        runInAction(() => {
            this.status = PageStatus.LOADING;

            AdminRequest.getGoodItems({
                limit: this.limit,
                offset: this.offset
            }).then((data) => {
                console.log(data);
                this.status = PageStatus.DONE;
            });
        });
    }
}
