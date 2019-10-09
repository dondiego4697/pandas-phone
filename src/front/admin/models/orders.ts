import {observable, action, runInAction} from 'mobx';

import {PageStatus} from '@denstep-core/libs/types';
import {ITableSchema} from '@denstep-core/components/table';
import {AdminRequest} from 'common/libs/api-requests';
import {OrderModel} from 'common/models/order';
import {textDictionary} from 'common/text-dictionary';

export class OrdersPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public limit = 20;
    @observable public offset = 0;
    @observable public total = 0;
    @observable public orders: OrderModel[] = [];

    @action public fetchData(): void {
        runInAction(() => {
            this.status = PageStatus.LOADING;

            AdminRequest.getOrders({
                limit: this.limit,
                offset: this.offset
            }).then((data) => {
                this.total = data.total || 1;
                this.orders = data.rows.map((row) => new OrderModel(row));
                this.status = PageStatus.DONE;
            });
        });
    }
}

export const ORDERS_TABLE_SCHEMA: ITableSchema<keyof OrderModel>[] = [
    {
        key: 'id',
        title: textDictionary['order.field.id']
    },
    {
        key: 'customerName',
        title: textDictionary['order.field.customerName']
    },
    {
        key: 'customerPhone',
        title: textDictionary['order.field.customerPhone']
    },
    {
        key: 'called',
        title: textDictionary['order.field.called'],
        type: 'boolean'
    },
    {
        key: 'orderDate',
        title: textDictionary['order.field.orderDate']
    }
];
