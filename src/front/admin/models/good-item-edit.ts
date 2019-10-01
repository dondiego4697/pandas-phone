import {observable, action, runInAction} from 'mobx';

import {PageStatus} from '@denstep-core/libs/types';
import {AdminRequest, IGoodItem} from '@denstep-core/libs/api-requests';

const DEFAULT_GOOD_ITEM = {
    type: 'iphone',
    original: true,
    public: false,
    discount: 0
} as IGoodItem;

const NEW_ID = 'new';

export class GoodItemEditPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public goodItem = DEFAULT_GOOD_ITEM;

    @action public fetchData(goodItemId: string): void {
        runInAction(() => {
            this.status = PageStatus.LOADING;
            if (goodItemId === NEW_ID) {
                this.status = PageStatus.DONE;
                return;
            }

            AdminRequest.getGoodItem(goodItemId)
                .then((data) => {
                    this.goodItem = data;
                    this.status = PageStatus.DONE;
                });
        });
    }

    @action public clearData(): void {
        this.goodItem = DEFAULT_GOOD_ITEM;
    }

    @action public updateGoodItem(goodItemId: string): Promise<IGoodItem> {
        this.status = PageStatus.LOADING;

        if (goodItemId === NEW_ID) {
            return AdminRequest
                .createGoodItem(beautifyGoodItem(this.goodItem))
                .finally(() => {
                    this.status = PageStatus.DONE;
                });
        }

        return AdminRequest
            .updateGoodItem(beautifyGoodItem(this.goodItem))
            .finally(() => {
                this.status = PageStatus.DONE;
            });
    }
}

function beautifyGoodItem(goodItem: IGoodItem): IGoodItem {
    const newGoodItem = Object.assign({}, goodItem);

    if (newGoodItem.search_tags && !newGoodItem.search_tags.length) {
        newGoodItem.search_tags = null;
    }

    delete newGoodItem.updated;

    return newGoodItem;
}
