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
import {Table} from '@denstep-core/components/table';
import {getAdminSimpleError} from '@denstep-core/components/popup';
import {OrderItemPageModel} from 'admin/models/order-item';
import {GOOD_ITEMS_TABLE_SCHEMA} from 'admin/models/good-items';

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
            .catch(() => this.props.history.replace('/bender-root/not-found'));
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
                    text={`Order item: ${orderItemId || 'new'}`}
                    typePreset='header'
                    colorPreset='dark'
                    className={b('text-header')}
                />
                <div className={b('container')}>
                    {this.renderTableContainer()}
                    {this.renderEditContainer()}
                </div>
            </div>
        );
    }

    private renderTableContainer(): React.ReactNode {
        if (this.props.orderItemPageModel!.isNewOrderItem) {
            return;
        }

        return (
            <div className={b('table-container')}>
                <Table
                    header={'Good item'}
                    schema={GOOD_ITEMS_TABLE_SCHEMA}
                    items={[this.props.orderItemPageModel!.orderItem]}
                    editable={{}}
                />
            </div>
        );
    }

    private renderEditContainer(): React.ReactNode {
        const {
            good_item_id,
            serial_number,
            imei
        } = this.props.orderItemPageModel!.orderItem;

        return (
            <div className={b('edit-container')}>
                <EditText
                    id='order-item-good-item-edit-text'
                    placeholder='Good item ID'
                    value={String(good_item_id)}
                    onChange={(value) => this.updateOrderItem('good_item_id', value)}
                />
                <EditText
                    id='order-item-serial-number-edit-text'
                    placeholder='Serial number'
                    value={String(serial_number)}
                    onChange={(value) => this.updateOrderItem('serial_number', value)}
                />
                <EditText
                    id='order-item-imei-edit-text'
                    placeholder='IMEI'
                    value={String(imei)}
                    onChange={(value) => this.updateOrderItem('imei', value)}
                />
                <Button
                    text='Save'
                    typePreset='button'
                    colorPreset='dark'
                    onClick={this.onSaveOrderItemClickHandler}
                />
            </div>
        );
    }

    private onSaveOrderItemClickHandler = () => {
        const orderItemId = this.props.match.params.orderItemId;
        const orderId = this.props.match.params.orderId;

        this.props.orderItemPageModel!.updateOrderItem(orderId)
            .then(() => {
                this.props.history.replace(`/bender-root/order/${orderId}`);
                this.props.orderItemPageModel!.fetchData(orderItemId);
            })
            .catch((err) => this.props.clientDataModel!.setPopupContent(
                getAdminSimpleError(err.response.data.message)
            ));
    }

    private updateOrderItem(key: string, value: any): void {
        (this.props.orderItemPageModel!.orderItem as any)[key] = value;
    }
}
