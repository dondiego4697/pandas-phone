import {observable, action, runInAction} from 'mobx';

import {PageStatus} from '@denstep-core/libs/types';
import {GoodItemModel, IGoodItemDbModel} from 'common/models/good-item';
import {AdminRequest} from 'common/libs/api-requests';

const DEFAULT_GOOD_ITEM = new GoodItemModel({
    type: 'iphone',
    brand: null,
    color: null,
    model: null,
    memory_capacity: null,
    search_tags: [] as string[],
    original: true,
    discount: 0,
    price: 1,
    public: false,
    updated: ''
});

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
                        this.goodItem = new GoodItemModel(data);
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

    @action public updateGoodItem(): Promise<IGoodItemDbModel> {
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

function beautifyGoodItem(goodItem: GoodItemModel): IGoodItemDbModel {
    const newGoodItem = {...goodItem.getDbData()};

    delete newGoodItem.updated;

    if (newGoodItem.memory_capacity) {
        (newGoodItem.memory_capacity as any) = String(newGoodItem.memory_capacity);
    }

    return newGoodItem;
}
