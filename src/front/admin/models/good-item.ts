import {observable, action, runInAction} from 'mobx';

import {PageStatus} from '@denstep-core/libs/types';
import {AdminRequest, IGoodItem} from '@denstep-core/libs/api-requests';

const DEFAULT_GOOD_ITEM = {
    discount: 0,
    original: true,
    price: 1,
    public: false,
    search_tags: [] as string[],
    type: 'iphone'
} as IGoodItem;

const NEW_ID = 'new';

export class GoodItemPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public goodItem = DEFAULT_GOOD_ITEM;
    @observable public isNewGoodItem = true;

    @action public fetchData(goodItemId: string): Promise<void> {
        this.isNewGoodItem = goodItemId === NEW_ID;

        return new Promise((resolve, reject) => {
            runInAction(() => {
                this.status = PageStatus.LOADING;

                if (this.isNewGoodItem) {
                    this.status = PageStatus.DONE;
                    resolve();
                    return;
                }

                AdminRequest.getGoodItem(goodItemId)
                    .then((data) => {
                        this.goodItem = data;
                        resolve();
                    })
                    .catch(reject)
                    .finally(() => this.status = PageStatus.DONE);
            });
        });
    }

    @action public clearData(): void {
        this.goodItem = DEFAULT_GOOD_ITEM;
    }

    @action public updateGoodItem(): Promise<IGoodItem> {
        this.status = PageStatus.LOADING;

        if (this.isNewGoodItem) {
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
    const newGoodItem = {...goodItem};

    delete newGoodItem.updated;

    return newGoodItem;
}
