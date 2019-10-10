import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';

import bevis from '@denstep-core/libs/bevis';
import {PageStatus} from '@denstep-core/libs/types';
import {ScreenLocker} from '@denstep-core/components/screen-locker';
import {ClientDataModel} from 'admin/models/client-data';
import {EditText} from '@denstep-core/components/edit-text';
import {Text} from '@denstep-core/components/text';
import {Button} from '@denstep-core/components/button';
import {getAdminSimpleError} from '@denstep-core/components/popup';
import {OrderItemPageModel} from 'admin/models/order-item';
import {IOrderItemModel} from 'common/models/order-item';
import {textDictionary} from 'common/text-dictionary';

import './index.scss';

interface IRouteParams {
    orderId: string;
    orderItemId: string;
}

interface IProps extends RouteComponentProps<IRouteParams> {
    clientDataModel?: ClientDataModel;
    orderItemPageModel?: OrderItemPageModel;
}

const b = bevis('order-item-page');

@inject('clientDataModel', 'orderItemPageModel')
@observer
export class OrderItemPage extends React.Component<IProps> {

    public componentDidMount(): void {
        window.scrollTo(0, 0);
        this.props.orderItemPageModel!
            .fetchData(this.props.match.params.orderItemId)
            .catch(() => this.props.history.replace('/bender-root/404'));
    }

    public componentWillUnmount(): void {
        this.props.orderItemPageModel!.clearData();
    }

    public render(): React.ReactNode {
        const orderItemId = this.props.match.params.orderItemId;

        return (
            <div className={b()}>
                <ScreenLocker
                    transparent={true}
                    show={this.props.orderItemPageModel!.status === PageStatus.LOADING}
                />
                <Text
                    text={
                        orderItemId ?
                            textDictionary['template.orderItem.header'].replace('%id', orderItemId) :
                            textDictionary['orderItem.new']
                    }
                    typePreset='header'
                    colorPreset='dark'
                    className={b('text-header')}
                />
                <div className={b('container')}>
                    {this.renderEditContainer()}
                </div>
            </div>
        );
    }

    private renderEditContainer(): React.ReactNode {
        const {
            goodItemId,
            serialNumber,
            imei
        } = this.props.orderItemPageModel!.orderItem;

        return (
            <div className={b('edit-container')}>
                <EditText
                    id='order-item-good-item-edit-text'
                    placeholder={textDictionary['orderItem.field.goodItemId']}
                    value={String(goodItemId)}
                    onChange={(value) => this.updateOrderItem('goodItemId', value)}
                />
                <EditText
                    id='order-item-serial-number-edit-text'
                    placeholder={textDictionary['orderItem.field.serialNumber']}
                    value={String(serialNumber)}
                    onChange={(value) => this.updateOrderItem('serialNumber', value)}
                />
                <EditText
                    id='order-item-imei-edit-text'
                    placeholder={textDictionary['orderItem.field.imei']}
                    value={String(imei)}
                    onChange={(value) => this.updateOrderItem('imei', value)}
                />
                <Button
                    text={textDictionary['button.save']}
                    typePreset='button'
                    colorPreset='dark'
                    onClick={this.onSaveOrderItemClickHandler}
                />
            </div>
        );
    }

    private onSaveOrderItemClickHandler = () => {
        const orderId = this.props.match.params.orderId;

        this.props.orderItemPageModel!.updateOrderItem(orderId)
            .then(() => {
                this.props.history.replace(`/bender-root/order/${orderId}`);
            })
            .catch((err) => this.props.clientDataModel!.setPopupContent(
                getAdminSimpleError(err.response.data.message)
            ));
    }

    private updateOrderItem(key: keyof IOrderItemModel, value: any): void {
        (this.props.orderItemPageModel!.orderItem as any)[key] = value;
    }
}
