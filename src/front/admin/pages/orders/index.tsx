import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';

import bevis from '@denstep-core/libs/bevis';
import {PageStatus} from '@denstep-core/libs/types';
import {ScreenLocker} from '@denstep-core/components/screen-locker';
import {Pagination} from '@denstep-core/components/pagination';
import {Table} from '@denstep-core/components/table';
import {ClientDataModel} from 'admin/models/client-data';
import {OrdersPageModel, ORDERS_TABLE_SCHEMA} from 'admin/models/orders';
import {textDictionary} from 'common/text-dictionary';
import {OrderModel} from 'common/models/order';

import './index.scss';

interface IProps extends RouteComponentProps<{}> {
    clientDataModel?: ClientDataModel;
    ordersPageModel?: OrdersPageModel;
}

const b = bevis('orders-page');

@inject('clientDataModel', 'ordersPageModel')
@observer
export class OrdersPage extends React.Component<IProps> {
    public componentDidMount(): void {
        this.props.ordersPageModel!.fetchData();
    }

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <ScreenLocker
                    transparent={true}
                    show={this.props.ordersPageModel!.status === PageStatus.LOADING}
                />

                <div className={b('container')}>
                    <div className={b('table-container')}>
                        <Table
                            header={textDictionary['table.orders.header']}
                            schema={ORDERS_TABLE_SCHEMA}
                            items={this.props.ordersPageModel!.orders}
                            editable={{
                                onAdd: this.onAddHandler,
                                onEdit: this.onEditHandler
                            }}
                        />
                    </div>
                    <div className={b('pagination-container')}>
                        <Pagination
                            limit={this.props.ordersPageModel!.limit}
                            offset={this.props.ordersPageModel!.offset}
                            total={this.props.ordersPageModel!.total}
                            onChange={this.onPaginationChageHandler}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private onAddHandler = (): void => {
        this.props.history.push('/bender-root/order/new');
    }

    private onEditHandler = (order: OrderModel): void => {
        this.props.history.push(`/bender-root/order/${order.id}`);
    }

    private onPaginationChageHandler = (offset: number): void => {
        this.props.ordersPageModel!.offset = offset;
        this.props.ordersPageModel!.fetchData();
    }
}
