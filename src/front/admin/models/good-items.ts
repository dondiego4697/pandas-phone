import {observable, action, runInAction} from 'mobx';

import {PageStatus} from '@denstep-core/libs/types';
import {AdminRequest, IGoodItem} from '@denstep-core/libs/api-requests';

export class GoodItemsPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public limit = 20;
    @observable public offset = 0;
    @observable public total = 0;
    @observable public data: IGoodItem[] = [];

    @action public fetchData(): void {
        runInAction(() => {
            this.status = PageStatus.LOADING;

            AdminRequest.getGoodItems({
                limit: this.limit,
                offset: this.offset
            }).then((data) => {
                this.total = data.total || 1;
                this.data = data.rows;
                this.status = PageStatus.DONE;
            });
        });
    }

    @action public deleteGoodItem(goodItemId: string): Promise<IGoodItem> {
        this.status = PageStatus.LOADING;

        return AdminRequest
            .deleteGoodItem(goodItemId)
            .finally(() => {
                this.status = PageStatus.DONE;
            });
    }
}
