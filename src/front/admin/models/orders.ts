import {observable, action, runInAction} from 'mobx';

import {PageStatus} from '@denstep-core/libs/types';
import {AdminRequest, IOrder} from '@denstep-core/libs/api-requests';
import {ITableSchema} from '@denstep-core/components/table';

export class OrdersPageModel {
    @observable public status = PageStatus.LOADING;
    @observable public limit = 20;
    @observable public offset = 0;
    @observable public total = 0;
    @observable public data: IOrder[] = [];

    @action public fetchData(): void {
        runInAction(() => {
            this.status = PageStatus.LOADING;

            AdminRequest.getOrders({
                limit: this.limit,
                offset: this.offset
            }).then((data) => {
                this.total = data.total || 1;
                this.data = data.rows;
                this.status = PageStatus.DONE;
            });
        });
    }
}

export const ORDERS_TABLE_SCHEMA: ITableSchema[] = [
    {
        key: 'id',
        title: 'ID'
    },
    {
        key: 'customer_name',
        title: 'Customer name'
    },
    {
        key: 'customer_phone',
        title: 'Customer phone'
    },
    {
        key: 'called',
        title: 'Called',
        type: 'boolean'
    },
    {
        key: 'order_date',
        title: 'Order date'
    }
];
