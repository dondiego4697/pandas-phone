import {observable, action, runInAction} from 'mobx';

import {PageStatus} from '@denstep-core/libs/types';
import {AdminRequest, IGoodItem} from '@denstep-core/libs/api-requests';

const EMPTY_GOOD_ITEM = {} as IGoodItem;
export class GoodItemEditPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public goodItem = EMPTY_GOOD_ITEM;

    @action public fetchData(goodItemId: string): void {
        runInAction(() => {
            this.status = PageStatus.LOADING;
            if (goodItemId === 'new') {
                this.status = PageStatus.DONE;
                return;
            }

            AdminRequest.getGoodItem(goodItemId)
                .then((data) => {
                    this.goodItem = data;
                    this.status = PageStatus.DONE;

                    console.log(data);
                });
        });
    }

    @action public clearData(): void {
        this.goodItem = EMPTY_GOOD_ITEM;
    }
}
