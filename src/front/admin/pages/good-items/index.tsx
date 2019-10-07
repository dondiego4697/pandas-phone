import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';

import bevis from '@denstep-core/libs/bevis';
import {PageStatus} from '@denstep-core/libs/types';
import {ScreenLocker} from '@denstep-core/components/screen-locker';
import {Pagination} from '@denstep-core/components/pagination';
import {Table} from '@denstep-core/components/table';
import {CheckBox, ICheckBoxItem} from '@denstep-core/components/check-box';
import {IGoodItem} from '@denstep-core/libs/api-requests';
import {getAdminSimpleError} from '@denstep-core/components/popup';
import {ClientDataModel} from 'admin/models/client-data';
import {GoodItemsPageModel, GOOD_ITEMS_TABLE_SCHEMA} from 'admin/models/good-items';
import {dbAllowedValues} from 'common/db-allowed-values';

import './index.scss';

interface IProps extends RouteComponentProps<{}> {
    clientDataModel?: ClientDataModel;
    goodItemsPageModel?: GoodItemsPageModel;
}

const b = bevis('good-items-page');

@inject('clientDataModel', 'goodItemsPageModel')
@observer
export class GoodItemsPage extends React.Component<IProps> {
    public componentDidMount(): void {
        this.props.goodItemsPageModel!.fetchData();
    }

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <ScreenLocker
                    transparent={true}
                    show={this.props.goodItemsPageModel!.status === PageStatus.LOADING}
                />
                <div className={b('container')}>
                    {this.renderFilterContainer()}
                    <div className={b('table-container')}>
                        <Table
                            header='Good items'
                            schema={GOOD_ITEMS_TABLE_SCHEMA}
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

    private renderFilterContainer(): React.ReactNode {
        return (
            <div className={b('filter-container')}>
                <div className={b('filter-wrapper')}>
                    <CheckBox
                        id='good-items-type-cb'
                        items={this.getSelectValues(dbAllowedValues['goodItem.type'])}
                        label='Type'
                        onChange={(selected) => this.updateFilter('goodItemType', selected)}
                        selected={this.props.goodItemsPageModel!.selected.goodItemType}
                    />
                </div>
                <div className={b('filter-wrapper')}>
                    <CheckBox
                        id='good-items-public-cb'
                        items={this.getSelectValues(['true', 'false'])}
                        label='Public'
                        onChange={(selected) => this.updateFilter('goodItemPublic', selected)}
                        selected={this.props.goodItemsPageModel!.selected.goodItemPublic}
                    />
                </div>
            </div>
        );
    }

    private updateFilter(key: string, selected: string[]): void {
        (this.props.goodItemsPageModel!.selected as any)[key] = selected;
        this.props.goodItemsPageModel!.fetchData();
    }

    private getSelectValues(arr: string[]): ICheckBoxItem[] {
        return arr.map((type) => ({key: type, value: type}));
    }

    private onAddHandler = (): void => {
        this.props.history.push('/bender-root/good-item/new');
    }

    private onEditHandler = (goodItem: IGoodItem): void => {
        this.props.history.push(`/bender-root/good-item/${goodItem.id}`);
    }

    private onDeleteHandler = (goodItem: IGoodItem): void => {
        if (!confirm('Are you sure?')) {
            return;
        }

        this.props.goodItemsPageModel!.deleteGoodItem(goodItem.id)
            .then(() => this.props.goodItemsPageModel!.fetchData())
            .catch((err) => this.props.clientDataModel!.setPopupContent(
                getAdminSimpleError(err.response.data.message)
            ));
    }

    private onPaginationChageHandler = (offset: number): void => {
        this.props.goodItemsPageModel!.offset = offset;
        this.props.goodItemsPageModel!.fetchData();
    }
}
