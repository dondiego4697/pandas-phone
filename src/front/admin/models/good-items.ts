import {observable, action, runInAction} from 'mobx';

import {PageStatus} from '@denstep-core/libs/types';
import {ITableSchema} from '@denstep-core/components/table';
import {GoodItemModel, IGoodItemDbModel, IGoodItemModel} from 'common/models/good-item';
import {AdminRequest} from 'common/libs/api-requests';
import {textDictionary} from 'common/text-dictionary';

interface IFilter {
    goodItemType: string[];
    goodItemPublic: string[];
}

export class GoodItemsPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public limit = 20;
    @observable public offset = 0;
    @observable public total = 0;
    @observable public goodItems: GoodItemModel[] = [];
    @observable public filter: IFilter = {
        goodItemPublic: [],
        goodItemType: []
    };

    @action public fetchData(): void {
        runInAction(() => {
            this.status = PageStatus.LOADING;

            AdminRequest.getGoodItems({
                isPublic: this.filter.goodItemPublic,
                limit: this.limit,
                offset: this.offset,
                type: this.filter.goodItemType
            }).then((data) => {
                this.total = data.total || 1;
                this.goodItems = data.rows.map((row) => new GoodItemModel(row));
                this.status = PageStatus.DONE;
            });
        });
    }

    @action public deleteGoodItem(goodItemId: string): Promise<IGoodItemDbModel> {
        this.status = PageStatus.LOADING;

        return AdminRequest
            .deleteGoodItem(goodItemId)
            .finally(() => {
                this.status = PageStatus.DONE;
            });
    }
}

export const GOOD_ITEMS_TABLE_SCHEMA: ITableSchema<keyof IGoodItemModel>[] = [
    {
        key: 'id',
        title: textDictionary['goodItem.field.id']
    },
    {
        key: 'type',
        title: textDictionary['goodItem.field.type']
    },
    {
        key: 'brand',
        title: textDictionary['goodItem.field.brand']
    },
    {
        key: 'model',
        title: textDictionary['goodItem.field.model']
    },
    {
        key: 'color',
        title: textDictionary['goodItem.field.color']
    },
    {
        key: 'memoryCapacity',
        title: textDictionary['goodItem.field.memoryCapacity']
    },
    {
        key: 'original',
        title: textDictionary['goodItem.field.original'],
        type: 'boolean'
    },
    {
        key: 'searchTags',
        title: textDictionary['goodItem.field.searchTags'],
        type: 'array'
    },
    {
        key: 'price',
        title: textDictionary['goodItem.field.price']
    },
    {
        key: 'discount',
        title: textDictionary['goodItem.field.discount']
    },
    {
        key: 'public',
        title: textDictionary['goodItem.field.public'],
        type: 'boolean'
    }
];
