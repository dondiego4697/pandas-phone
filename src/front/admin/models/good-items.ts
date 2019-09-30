import {observable, action, runInAction} from 'mobx';

import {PageStatus} from '@denstep-core/libs/types';
import {AdminRequest} from '@denstep-core/libs/api-requests';

export class GoodItemsPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public limit = 100;
    @observable public offset = 0;
    @observable public total = 0;
    @observable public data: any[] = [];

    @action public fetchData(): void {
        runInAction(() => {
            this.status = PageStatus.LOADING;

            AdminRequest.getGoodItems({
                limit: this.limit,
                offset: this.offset
            }).then((data) => {
                this.total = data.total;
                this.data = data.rows;
                this.status = PageStatus.DONE;

                console.log(data);
            });
        });
    }
}
