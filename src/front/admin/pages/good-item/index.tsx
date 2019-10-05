import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';

import bevis from '@denstep-core/libs/bevis';
import {PageStatus} from '@denstep-core/libs/types';
import {Switch} from '@denstep-core/components/switch';
import {CheckBox} from '@denstep-core/components/check-box';
import {SelectBox, ISelectBoxItem} from '@denstep-core/components/select-box';
import {Text} from '@denstep-core/components/text';
import {EditText} from '@denstep-core/components/edit-text';
import {getAdminSimpleError} from '@denstep-core/components/popup';
import {Button} from '@denstep-core/components/button';
import {ScreenLocker} from '@denstep-core/components/screen-locker';
import {dbAllowedValues} from 'common/db-allowed-values';
import {ClientDataModel} from 'admin/models/client-data';
import {GoodItemPageModel} from 'admin/models/good-item';

import './index.scss';

interface IRouteParams {
    goodItemId: string;
}

interface IProps extends RouteComponentProps<IRouteParams> {
    clientDataModel?: ClientDataModel;
    goodItemPageModel?: GoodItemPageModel;
}

const b = bevis('good-item-page');

@inject('clientDataModel', 'goodItemPageModel')
@observer
export class GoodItemPage extends React.Component<IProps> {

    public componentDidMount(): void {
        this.props.goodItemPageModel!
            .fetchData(this.props.match.params.goodItemId)
            .catch(() => this.props.history.replace('/bender-root/not-found'));
    }

    public componentWillUnmount(): void {
        this.props.goodItemPageModel!.clearData();
    }

    public render(): React.ReactNode {
        const {
            id,
            type,
            brand,
            model,
            color,
            memory_capacity,
            price, discount,
            original, public: isPublic,
            search_tags

        } = this.props.goodItemPageModel!.goodItem;

        return (
            <div className={b()}>
                <ScreenLocker
                    transparent={true}
                    show={this.props.goodItemPageModel!.status === PageStatus.LOADING}
                />
                <Text
                    text={`Good item: ${id || 'new'}`}
                    typePreset='header'
                    colorPreset='dark'
                    className={b('text-header')}
                />
                <div className={b('container')}>
                    <div className={b('paper-wrapper')}>
                        <SelectBox
                            placeholder='Type'
                            items={this.getSelectValues(dbAllowedValues['goodItem.type'])}
                            selected={type}
                            onChange={(key) => this.updateGoodItem('type', key)}
                        />
                        <SelectBox
                            placeholder='Brand'
                            items={this.getSelectValues(dbAllowedValues['goodItem.brand'])}
                            selected={brand}
                            onChange={(key) => this.updateGoodItem('brand', key)}
                        />

                        <SelectBox
                            placeholder='Model'
                            items={this.getModelItems()}
                            selected={model}
                            onChange={(key) => this.updateGoodItem('model', key)}
                        />

                        <SelectBox
                            placeholder='Color'
                            items={this.getColorItems()}
                            selected={color}
                            onChange={(key) => this.updateGoodItem('color', key)}
                        />

                        {
                            type !== 'airpod' &&
                            <SelectBox
                                placeholder='Memory capacity'
                                items={this.getSelectValues(
                                    dbAllowedValues['goodItem.iphoneMemoryCapacity'].map(String)
                                )}
                                selected={String(memory_capacity)}
                                onChange={(key) => this.updateGoodItem('memory_capacity', key)}
                            />
                        }

                        <EditText
                            id='good-item-price-edit-text'
                            placeholder='Price'
                            value={String(price)}
                            onChange={(value) => this.updateGoodItem('price', value)}
                            options={{type: 'number', minValue: 0}}
                        />
                        <EditText
                            id='good-item-discount-edit-text'
                            placeholder='Discount'
                            value={String(discount)}
                            onChange={(value) => this.updateGoodItem('discount', value)}
                            options={{type: 'number', minValue: 0, maxValue: 100}}
                        />
                    </div>

                    <div className={b('switch-wrapper')}>
                        <div className={b('switch-item-wrapper')}>
                            <Switch
                                label='Original:'
                                initialValue={Boolean(original)}
                                onChange={(value) => this.updateGoodItem('original', value)}
                            />
                        </div>
                        <div className={b('switch-item-wrapper')}>
                            <Switch
                                label='Public:'
                                initialValue={Boolean(isPublic)}
                                onChange={(value) => this.updateGoodItem('public', value)}
                            />
                        </div>
                        <div className={b('switch-item-wrapper')}>
                            <CheckBox
                                label='Search tags:'
                                selected={(search_tags).map(String)}
                                items={this.getSelectValues(dbAllowedValues['goodItem.searchTag'])}
                                onChange={(selected) => this.updateGoodItem('search_tags', selected)}
                            />
                        </div>
                    </div>

                    <div className={b('control-wrapper')}>
                        <Button
                            text='Save'
                            colorPreset='dark'
                            typePreset='button'
                            onClick={this.onSaveClickHandler}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private updateGoodItem(key: string, value: any): void {
        if (key === 'type') {
            this.props.goodItemPageModel!.clearData();
        }

        (this.props.goodItemPageModel!.goodItem as any)[key] = value;
    }

    private getSelectValues(arr: string[]): ISelectBoxItem[] {
        return arr.map((type) => ({key: type, value: type}));
    }

    private getModelItems(): ISelectBoxItem[] {
        if (this.props.goodItemPageModel!.goodItem.type === 'airpod') {
            return this.getSelectValues(dbAllowedValues['goodItem.airpod.model']);
        }

        return this.getSelectValues(dbAllowedValues['goodItem.iphone.model']);
    }

    private getColorItems(): ISelectBoxItem[] {
        if (this.props.goodItemPageModel!.goodItem.type === 'airpod') {
            return this.getSelectValues(dbAllowedValues['goodItem.airpod.color']);
        }

        return this.getSelectValues(dbAllowedValues['goodItem.iphone.color']);
    }

    private onSaveClickHandler = (): void => {
        this.props.goodItemPageModel!
            .updateGoodItem()
            .then(() => this.props.history.replace('/bender-root'))
            .catch((err) => this.props.clientDataModel!.setPopupContent(
                getAdminSimpleError(err.response.data.message)
            ));
    }
}
