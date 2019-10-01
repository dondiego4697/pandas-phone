import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';

import bevis from '@denstep-core/libs/bevis';
import {PageStatus} from '@denstep-core/libs/types';
import {ScreenLocker} from '@denstep-core/components/screen-locker';
import {Switch} from '@denstep-core/components/switch';
import {SelectBox} from '@denstep-core/components/select-box';
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
                    <div className={b('paper-wrapper')}>

                    </div>

                    <div className={b('paper-wrapper')}>
                        <SelectBox
                            placeholder='Type'
                            items={
                                dbAllowedValues['goodItem.type'].map((type) => ({key: type, value: type}))
                            }
                            selected={this.props.goodItemEditPageModel!.goodItem.type}
                            onChange={(key) => {
                                this.props.goodItemEditPageModel!.goodItem.type = key as any
                            }}
                        />

                        <SelectBox
                            placeholder='Brand'
                            items={
                                dbAllowedValues['goodItem.brand'].map((type) => ({key: type, value: type}))
                            }
                            selected={this.props.goodItemEditPageModel!.goodItem.brand || ''}
                            onChange={(key) => {
                                this.props.goodItemEditPageModel!.goodItem.brand = key;
                            }}
                        />
                    </div>

                    <div className={b('paper-wrapper')}>
                        <Switch
                            label='Original:'
                            initialValue={Boolean(this.props.goodItemEditPageModel!.goodItem.original)}
                            onChange={(value) => {
                                this.props.goodItemEditPageModel!.goodItem.original = value;
                            }}
                        />
                        <Switch
                            label='Public:'
                            initialValue={Boolean(this.props.goodItemEditPageModel!.goodItem.public)}
                            onChange={(value) => {
                                this.props.goodItemEditPageModel!.goodItem.public = value;
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
