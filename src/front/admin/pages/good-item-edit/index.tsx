import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';

import bevis from '@denstep-core/libs/bevis';
import {PageStatus} from '@denstep-core/libs/types';
import {ScreenLocker} from '@denstep-core/components/screen-locker';
import {Switch} from '@denstep-core/components/switch';
import {CheckBox} from '@denstep-core/components/check-box';
import {SelectBox} from '@denstep-core/components/select-box';
import {EditText} from '@denstep-core/components/edit-text';
import {Button} from '@denstep-core/components/button';
import {dbAllowedValues} from 'common/db-allowed-values';
import {ClientDataModel} from 'admin/models/client-data';
import {Bender} from 'admin/components/bender';
import {GoodItemEditPageModel} from 'admin/models/good-item-edit';

import './index.scss';

interface IRouteParams {
    goodItemId: string;
}

interface IProps extends RouteComponentProps<IRouteParams> {
    clientDataModel?: ClientDataModel;
    goodItemEditPageModel?: GoodItemEditPageModel;
}

const b = bevis('good-item-edit');

@inject('clientDataModel', 'goodItemEditPageModel')
@observer
export class GoodItemEditPage extends React.Component<IProps> {

    public componentDidMount(): void {
        this.props.goodItemEditPageModel!.fetchData(this.props.match.params.goodItemId);
    }

    public componentWillUnmount(): void {
        this.props.goodItemEditPageModel!.clearData();
    }

    public render(): React.ReactNode {
        if (this.props.goodItemEditPageModel!.status === PageStatus.LOADING) {
            return <ScreenLocker preset='#blue'/>;
        }

        return (
            <div className={b()}>
                <Bender/>
                <div className={b('container')}>
                    <div className={b('switch-wrapper')}>
                        <div className={b('switch-item-wrapper')}>
                            <Switch
                                label='Original:'
                                initialValue={Boolean(this.props.goodItemEditPageModel!.goodItem.original)}
                                onChange={(value) => this.updateGoodItem('original', value)}
                            />
                        </div>
                        <div className={b('switch-item-wrapper')}>
                            <Switch
                                label='Public:'
                                initialValue={Boolean(this.props.goodItemEditPageModel!.goodItem.public)}
                                onChange={(value) => this.updateGoodItem('public', value)}
                            />
                        </div>
                    </div>

                    <div className={b('paper-wrapper')}>
                        <SelectBox
                            placeholder='Type'
                            items={this.getSelectValues(dbAllowedValues['goodItem.type'])}
                            selected={this.props.goodItemEditPageModel!.goodItem.type}
                            onChange={(key) => this.updateGoodItem('type', key)}
                        />
                        <SelectBox
                            placeholder='Brand'
                            items={this.getSelectValues(dbAllowedValues['goodItem.brand'])}
                            selected={this.props.goodItemEditPageModel!.goodItem.brand}
                            onChange={(key) => this.updateGoodItem('brand', key)}
                        />

                        <SelectBox
                            placeholder='Model'
                            items={this.getModelItems()}
                            selected={this.props.goodItemEditPageModel!.goodItem.model}
                            onChange={(key) => this.updateGoodItem('model', key)}
                        />

                        <SelectBox
                            placeholder='Color'
                            items={this.getColorItems()}
                            selected={this.props.goodItemEditPageModel!.goodItem.color}
                            onChange={(key) => this.updateGoodItem('color', key)}
                        />

                        {
                            this.props.goodItemEditPageModel!.goodItem.type !== 'airpod' &&
                            <SelectBox
                                placeholder='Memory capacity'
                                items={this.getSelectValues(
                                    dbAllowedValues['goodItem.iphoneMemoryCapacity'].map(String)
                                )}
                                selected={String(this.props.goodItemEditPageModel!.goodItem.memory_capacity)}
                                onChange={(key) => this.updateGoodItem('memory_capacity', key)}
                            />
                        }
                    </div>

                    <div className={b('paper-wrapper')}>
                        <CheckBox
                            label='Search tags:'
                            selected={(this.props.goodItemEditPageModel!.goodItem.search_tags || []).map(String)}
                            items={dbAllowedValues['goodItem.searchTag']}
                            onChange={(selected) => this.updateGoodItem('search_tags', selected)}
                        />
                    </div>

                    <div className={b('paper-wrapper')}>
                        <EditText
                            id='good-item-price-edit-text'
                            placeholder='Price'
                            value={String(this.props.goodItemEditPageModel!.goodItem.price || '')}
                            onChange={(value) => this.updateGoodItem('price', value)}
                            options={{type: 'number', minValue: 0}}
                        />
                        <EditText
                            id='good-item-discount-edit-text'
                            placeholder='Discount'
                            value={String(this.props.goodItemEditPageModel!.goodItem.discount)}
                            onChange={(value) => this.updateGoodItem('discount', value)}
                            options={{type: 'number', minValue: 0, maxValue: 100}}
                        />
                    </div>

                    <div className={b('control-wrapper')}>
                        <Button
                            text='Save'
                            onClick={() => {this.onSaveClickHandler}}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private updateGoodItem(key: string, value: any) {
        if (key === 'type') {
            this.props.goodItemEditPageModel!.clearData();
        }

        (this.props.goodItemEditPageModel!.goodItem as any)[key] = value;
    }

    private getSelectValues(arr: string[]) {
        return arr.map((type) => ({key: type, value: type}));
    }

    private getModelItems() {
        if (this.props.goodItemEditPageModel!.goodItem.type === 'airpod') {
            return this.getSelectValues(dbAllowedValues['goodItem.airpod.model']);
        }

        return this.getSelectValues(dbAllowedValues['goodItem.iphone.model']);
    }

    private getColorItems() {
        if (this.props.goodItemEditPageModel!.goodItem.type === 'airpod') {
            return this.getSelectValues(dbAllowedValues['goodItem.airpod.color']);
        }

        return this.getSelectValues(dbAllowedValues['goodItem.iphone.color']);
    }

    private onSaveClickHandler = () => {
        // TODO send request (create, update) -> show alerts with error or open history.replace()
    }
}
