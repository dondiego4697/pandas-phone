import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';

import bevis from '@denstep-core/libs/bevis';
import {PageStatus} from '@denstep-core/libs/types';
import {ScreenLocker} from '@denstep-core/components/screen-locker';
import {Pagination} from '@denstep-core/components/pagination';
import {Table} from '@denstep-core/components/table';
import {IGoodItem} from '@denstep-core/libs/api-requests';
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
                    <div className={b('table-container')}>
                        <Table
                            header='Good items'
                            schema={this.props.goodItemsPageModel!.getTableSchema()}
                            items={this.props.goodItemsPageModel!.data}
                            editable={{
                                onAdd: this.onAddHandler,
                                onDelete: this.onDeleteHandler,
                                onEdit: this.onEditHandler
                            }}
                        />
                    </div>
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

    private onDeleteHandler = (data: IGoodItem): void => {
        if (!confirm('Are you sure?')) {
            return;
        }

        this.props.goodItemsPageModel!.deleteGoodItem(data.id)
            .then(() => this.props.goodItemsPageModel!.fetchData())
            .catch((err) => alert(err.response.data.message));
    }

    private onPaginationChageHandler = (offset: number): void => {
        this.props.goodItemsPageModel!.offset = offset;
        this.props.goodItemsPageModel!.fetchData();
    }
}
