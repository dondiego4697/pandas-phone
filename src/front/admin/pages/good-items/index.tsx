import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';

import bevis from '@denstep-core/libs/bevis';
import {PageStatus} from '@denstep-core/libs/types';
import {ScreenLocker} from '@denstep-core/components/screen-locker';
import {Pagination} from '@denstep-core/components/pagination';
import {Table} from '@denstep-core/components/table';
import {CheckBox} from '@denstep-core/components/check-box';
import {getAdminSimpleError} from '@denstep-core/components/popup';
import {ClientDataModel} from 'admin/models/client-data';
import {GoodItemsPageModel, GOOD_ITEMS_TABLE_SCHEMA} from 'admin/models/good-items';
import {dbAllowedPairs, getDbAllowedValue} from 'common/db-allowed-values';
import {GoodItemModel} from 'common/models/good-item';
import {textDictionary} from 'common/text-dictionary';

import './index.scss';

interface IProps extends RouteComponentProps<{}> {
    clientDataModel?: ClientDataModel;
    goodItemsPageModel?: GoodItemsPageModel;
}

const b = bevis('good-items-page');

@inject('clientDataModel', 'goodItemsPageModel')
@observer
export class GoodItemsPage extends React.Component<IProps> {
    public static prepareGoodItemForTable(item: GoodItemModel): Record<string, any> {
        return {
            ...item,
            type: getDbAllowedValue('goodItem.type', item.type),
            brand: getDbAllowedValue('goodItem.brand', item.brand),
            model: getDbAllowedValue(
                [
                    'goodItem.iphone.model',
                    'goodItem.airpod.model'
                ],
                item.model
            ),
            color: getDbAllowedValue(
                [
                    'goodItem.airpod.color',
                    'goodItem.iphone.color'
                ],
                item.color
            ),
            searchTags: item.searchTags.map((tag) => getDbAllowedValue('goodItem.searchTag', tag))
        };
    }

    private static prepareGoodItemsForTable(items: GoodItemModel[]): Record<string, any>[] {
        return items.map((item) => GoodItemsPage.prepareGoodItemForTable(item));
    }

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
                            header={textDictionary['table.goodItems.header']}
                            schema={GOOD_ITEMS_TABLE_SCHEMA}
                            items={GoodItemsPage.prepareGoodItemsForTable(this.props.goodItemsPageModel!.goodItems)}
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
                        items={dbAllowedPairs['goodItem.type']}
                        label={textDictionary['goodItem.field.type']}
                        onChange={(selected) => this.updateFilter('goodItemType', selected)}
                        selected={this.props.goodItemsPageModel!.filter.goodItemType}
                    />
                </div>
                <div className={b('filter-wrapper')}>
                    <CheckBox
                        id='good-items-public-cb'
                        items={[
                            {
                                key: 'true',
                                value: textDictionary['boolean.yes']
                            },
                            {
                                key: 'false',
                                value: textDictionary['boolean.no']
                            }
                        ]}
                        label={textDictionary['goodItem.field.public']}
                        onChange={(selected) => this.updateFilter('goodItemPublic', selected)}
                        selected={this.props.goodItemsPageModel!.filter.goodItemPublic}
                    />
                </div>
            </div>
        );
    }

    private updateFilter(key: string, selected: string[]): void {
        (this.props.goodItemsPageModel!.filter as any)[key] = selected;
        this.props.goodItemsPageModel!.offset = 0;
        this.props.goodItemsPageModel!.fetchData();
    }

    private onAddHandler = (): void => {
        this.props.history.push('/bender-root/good-item/new');
    }

    private onEditHandler = (goodItem: GoodItemModel): void => {
        this.props.history.push(`/bender-root/good-item/${goodItem.id}`);
    }

    private onDeleteHandler = (goodItem: GoodItemModel): void => {
        if (!confirm(textDictionary['confirm.sureQuestion'])) {
            return;
        }

        this.props.goodItemsPageModel!.deleteGoodItem(goodItem.id!)
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
