import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';

import bevis from '@denstep-core/libs/bevis';
import {PageStatus} from '@denstep-core/libs/types';
import {ScreenLocker} from '@denstep-core/components/screen-locker';
import {Pagination} from '@denstep-core/components/pagination';
import {Paper} from '@denstep-core/components/paper';
import {Table, ITableSchema} from '@denstep-core/components/table';
import {ClientDataModel} from 'admin/models/client-data';
import {Bender} from 'admin/components/bender';
import {GoodItemsPageModel} from 'admin/models/good-items';

import './index.scss';

interface IProps extends RouteComponentProps<{}> {
    clientDataModel?: ClientDataModel;
    goodItemsPageModel?: GoodItemsPageModel;
}

const b = bevis('good-items');

@inject('clientDataModel', 'goodItemsPageModel')
@observer
export class GoodItemsPage extends React.Component<IProps> {

    public componentDidMount(): void {
        this.props.goodItemsPageModel!.fetchData();
    }

    public render(): React.ReactNode {
        if (this.props.goodItemsPageModel!.status === PageStatus.LOADING) {
            return <ScreenLocker preset='#blue'/>;
        }

        return (
            <div className={b()}>
                <Bender/>
                <div className={b('container')}>
                    <Paper>
                        <div className={b('paper-wrapper')}>
                            <div className={b('table-container')}>
                                <Table
                                    header='Good items'
                                    schema={this.getTableSchema()}
                                    items={this.props.goodItemsPageModel!.data}
                                    editable={{
                                        onAdd: this.onAddHandler,
                                        onDelete: this.onDeleteHandler,
                                        onEdit: this.onEditHandler
                                    }}
                                />
                            </div>
                        </div>
                    </Paper>
                    <div className={b('pagination-container')}>
                        <Pagination
                            limit={this.props.goodItemsPageModel!.limit}
                            offset={this.props.goodItemsPageModel!.offset}
                            total={this.props.goodItemsPageModel!.total}
                            onChange={this.onPaginationChageHandler}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private onAddHandler = (): void => {
        this.props.history.push('/bender-root/good-item/new');
    }

    private onEditHandler = (data: any): void => {
        this.props.history.push(`/bender-root/good-item/${data.id}`);
    }

    private onDeleteHandler = (data: any): void => {
        // TODO send request on Delete -> refresh data or show alert
    }

    private onPaginationChageHandler = (offset: number): void => {
        this.props.goodItemsPageModel!.offset = offset;
        this.props.goodItemsPageModel!.fetchData();
    }

    private getTableSchema(): ITableSchema[] {
        return [
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
    }
}
