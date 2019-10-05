import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';

import bevis from '@denstep-core/libs/bevis';
import {PageStatus} from '@denstep-core/libs/types';
import {ScreenLocker} from '@denstep-core/components/screen-locker';
import {Text} from '@denstep-core/components/text';
import {Switch} from '@denstep-core/components/switch';
import {IOrderItem} from '@denstep-core/libs/api-requests';
import {EditText} from '@denstep-core/components/edit-text';
import {Table} from '@denstep-core/components/table';
import {Button} from '@denstep-core/components/button';
import {getAdminSimpleError} from '@denstep-core/components/popup';
import {ClientDataModel} from 'admin/models/client-data';
import {OrderPageModel, ORDER_ITEMS_TABLE_SCHEMA} from 'admin/models/order';

import './index.scss';

interface IRouteParams {
    orderId: string;
}

interface IProps extends RouteComponentProps<IRouteParams> {
    clientDataModel?: ClientDataModel;
    orderPageModel?: OrderPageModel;
}

const b = bevis('order-page');

@inject('clientDataModel', 'orderPageModel')
@observer
export class OrderPage extends React.Component<IProps> {

    public componentDidMount(): void {
        this.props.orderPageModel!
            .fetchData(this.props.match.params.orderId)
            .catch(() => this.props.history.replace('/bender-root/not-found'));
    }

    public componentWillUnmount(): void {
        this.props.orderPageModel!.clearData();
        // TODO add filter in good-items
    }

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <ScreenLocker
                    transparent={true}
                    show={this.props.orderPageModel!.status === PageStatus.LOADING}
                />
                <Text
                    text={`Order: ${this.props.orderPageModel!.order.id || 'new'}`}
                    typePreset='header'
                    colorPreset='dark'
                    className={b('text-header')}
                />
                <div className={b('container')}>
                    {this.renderOrderEditControl()}
                    {this.renderOrderTotalPrice()}
                    {this.renderOrderControl()}
                    {this.renderTable()}
                </div>
            </div>
        );
    }

    private renderOrderTotalPrice(): React.ReactNode {
        if (this.props.orderPageModel!.isNewOrder) {
            return;
        }

        return (
            <div className={b('total-price-container')}>
                <Text
                    className={b('total-price')}
                    text={`Total price: ${this.props.orderPageModel!.totalPrice}`}
                    typePreset='header'
                    colorPreset='dark'
                    textAlign='center'
                />
            </div>
        );
    }

    private renderOrderControl(): React.ReactNode {
        if (this.props.orderPageModel!.isNewOrder) {
            return;
        }

        return (
            <div className={b('order-control')}>
                <Button
                    text='Resolve'
                    colorPreset='green'
                    typePreset='button'
                    onClick={this.onResolveClickHandler}
                />
                <Button
                    text='Reject'
                    colorPreset='red'
                    typePreset='button'
                    onClick={this.onRejectClickHandler}
                />
            </div>
        );
    }

    private renderOrderEditControl(): React.ReactNode {
        const {
            called,
            customer_name,
            customer_phone
        } = this.props.orderPageModel!.order;

        return (
            <div>
                <div className={b('order-wrapper')}>
                    <Switch
                        label='Called:'
                        initialValue={Boolean(called)}
                        onChange={(value) => this.updateOrder('called', value)}
                    />
                    <EditText
                        id='order-customer-name-edit-text'
                        placeholder='Customer name'
                        value={String(customer_name)}
                        onChange={(value) => this.updateOrder('customer_name', value)}
                    />
                    <EditText
                        id='order-customer-phone-edit-text'
                        placeholder='Customer phone'
                        value={String(customer_phone)}
                        onChange={(value) => this.updateOrder('customer_phone', value)}
                        options={{type: 'phonenumber'}}
                    />
                </div>
                <div className={b('control-wrapper')}>
                    <Button
                        text='Save changes'
                        colorPreset='dark'
                        typePreset='button'
                        onClick={this.onSaveOrderClickHandler}
                    />
                </div>
            </div>
        );
    }

    private renderTable(): React.ReactNode {
        if (this.props.orderPageModel!.isNewOrder) {
            return;
        }

        return (
            <div className={b('table-wrapper')}>
                <Table
                    header='Order items'
                    schema={ORDER_ITEMS_TABLE_SCHEMA}
                    items={this.props.orderPageModel!.orderItems}
                    editable={{
                        onAdd: this.onOrderItemAddHandler,
                        onDelete: this.onOrderItemDeleteHandler,
                        onEdit: this.onOrderItemEditHandler
                    }}
                />
            </div>
        );
    }

    private updateOrder(key: string, value: any): void {
        (this.props.orderPageModel!.order as any)[key] = value;
    }

    private onOrderItemAddHandler = (): void => {
        const orderId = this.props.match.params.orderId;
        this.props.history.push(`/bender-root/order/${orderId}/item/new`);
    }

    private onOrderItemEditHandler = (orderItem: IOrderItem): void => {
        const orderId = this.props.match.params.orderId;
        const orderItemId = orderItem.order_item_id;
        this.props.history.push(`/bender-root/order/${orderId}/item/${orderItemId}`);
    }

    private onOrderItemDeleteHandler = (orderItem: IOrderItem): void => {
        if (!confirm('Are you sure?')) {
            return;
        }

        this.props.orderPageModel!
            .deleteOrderItem(orderItem.order_item_id)
            .then(() => this.props.orderPageModel!.fetchData(this.props.match.params.orderId))
            .catch((err) => this.props.clientDataModel!.setPopupContent(
                getAdminSimpleError(err.response.data.message)
            ));
    }

    private onResolveClickHandler = (): void => {
        if (!confirm('Are you sure?')) {
            return;
        }

        this.props.orderPageModel!
            .resolveOrder(this.props.match.params.orderId)
            .then(() => this.props.history.replace('/bender-root/orders'))
            .catch((err) => this.props.clientDataModel!.setPopupContent(
                getAdminSimpleError(err.response.data.message)
            ));
    }

    private onRejectClickHandler = (): void => {
        if (!confirm('Are you sure?')) {
            return;
        }

        this.props.orderPageModel!
            .rejectOrder(this.props.match.params.orderId)
            .then(() => this.props.history.replace('/bender-root/orders'))
            .catch((err) => this.props.clientDataModel!.setPopupContent(
                getAdminSimpleError(err.response.data.message)
            ));
    }

    private onSaveOrderClickHandler = (): void => {
        this.props.orderPageModel!
            .updateOrder()
            .then((order) => {
                this.props.match.params.orderId = order.id;
                this.props.history.replace(`/bender-root/order/${order.id}`);
                this.props.orderPageModel!.fetchData(order.id);
            })
            .catch((err) => this.props.clientDataModel!.setPopupContent(
                getAdminSimpleError(err.response.data.message)
            ));
    }
}
