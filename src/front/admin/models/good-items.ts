import {observable, action, runInAction} from 'mobx';

import {PageStatus} from '@denstep-core/libs/types';
import {AdminRequest, IGoodItem} from '@denstep-core/libs/api-requests';
import {ITableSchema} from '@denstep-core/components/table';

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

export const GOOD_ITEMS_TABLE_SCHEMA: ITableSchema[] = [
    {
        key: 'id',
        title: 'ID'
    },
    {
        key: 'type',
        title: 'Type'
    },
    {
        key: 'brand',
        title: 'Brand'
    },
    {
        key: 'model',
        title: 'Model'
    },
    {
        key: 'color',
        title: 'Color'
    },
    {
        key: 'memory_capacity',
        title: 'Memory capacity'
    },
    {
        key: 'original',
        title: 'Original',
        type: 'boolean'
    },
    {
        key: 'search_tags',
        title: 'Search tags',
        type: 'array'
    },
    {
        key: 'price',
        title: 'Price'
    },
    {
        key: 'discount',
        title: 'Discount'
    },
    {
        key: 'public',
        title: 'Public',
        type: 'boolean'
    }
];
