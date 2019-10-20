import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';

import {GoodItemsPage} from 'admin/pages/good-items';
import bevis from '@denstep-core/libs/bevis';
import {PageStatus} from '@denstep-core/libs/types';
import {ScreenLocker} from '@denstep-core/components/screen-locker';
import {Text} from '@denstep-core/components/text';
import {Switch} from '@denstep-core/components/switch';
import {EditText} from '@denstep-core/components/edit-text';
import {Table} from '@denstep-core/components/table';
import {Button} from '@denstep-core/components/button';
import {getAdminSimpleError} from '@denstep-core/components/popup';
import {ClientDataModel} from 'admin/models/client-data';
import {OrderPageModel, ORDER_ITEMS_TABLE_SCHEMA} from 'admin/models/order';
import {OrderItemModel} from 'common/models/order-item';
import {IOrderModel} from 'common/models/order';
import {textDictionary} from 'common/text-dictionary';

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
            .catch(() => this.props.history.replace('/bender-root/404'));
    }

    public componentWillUnmount(): void {
        this.props.orderPageModel!.clearData();
    }

    public render(): React.ReactNode {
        const {id} = this.props.orderPageModel!.order;
        return (
            <div className={b()}>
                <ScreenLocker
                    transparent={true}
                    show={this.props.orderPageModel!.status === PageStatus.LOADING}
                />
                <Text
                    text={
                        id ?
                            textDictionary['template.order.header'].replace('%id', id) :
                            textDictionary['order.new']
                    }
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
                    text={
                        textDictionary['template.order.resultSum']
                            .replace('%sum', this.props.orderPageModel!.totalPrice)
                    }
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
                    text={textDictionary['order.resolve']}
                    colorPreset='green'
                    typePreset='button'
                    onClick={this.onResolveClickHandler}
                />
                <Button
                    text={textDictionary['order.reject']}
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
            customerName,
            customerPhone
        } = this.props.orderPageModel!.order;

        return (
            <div>
                <div className={b('order-wrapper')}>
                    <Switch
                        label={`${textDictionary['order.field.called']}:`}
                        initialValue={Boolean(called)}
                        onChange={(value) => this.updateOrder('called', value)}
                    />
                    <EditText
                        id='order-customer-name-edit-text'
                        placeholder={textDictionary['order.field.customerName']}
                        value={String(customerName)}
                        onChange={(value) => this.updateOrder('customerName', value)}
                    />
                    <EditText
                        id='order-customer-phone-edit-text'
                        placeholder={textDictionary['order.field.customerPhone']}
                        value={String(customerPhone)}
                        onChange={(value) => this.updateOrder('customerPhone', value)}
                        options={{type: 'phonenumber'}}
                    />
                </div>
                <div className={b('control-wrapper')}>
                    <Button
                        text={textDictionary['button.save']}
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
                    header={textDictionary['table.orderItems.header']}
                    schema={ORDER_ITEMS_TABLE_SCHEMA}
                    items={this.prepareOrderItemsTable(this.props.orderPageModel!.orderItems)}
                    editable={{
                        onAdd: this.onOrderItemAddHandler,
                        onDelete: this.onOrderItemDeleteHandler,
                        onEdit: this.onOrderItemEditHandler
                    }}
                />
            </div>
        );
    }

    private prepareOrderItemsTable(items: OrderItemModel[]): Record<string, any>[] {
        return items.map((item) => {
            return {
                ...GoodItemsPage.prepareGoodItemForTable(item.goodItem!),
                ...item
            };
        });
    }

    private updateOrder(key: keyof IOrderModel, value: any): void {
        (this.props.orderPageModel!.order as any)[key] = value;
    }

    private onOrderItemAddHandler = (): void => {
        const orderId = this.props.match.params.orderId;
        this.props.history.push(`/bender-root/order/${orderId}/item/new`);
    }

    private onOrderItemEditHandler = (orderItem: OrderItemModel): void => {
        const orderId = this.props.match.params.orderId;
        const orderItemId = orderItem.id;
        this.props.history.replace(`/bender-root/order/${orderId}/item/${orderItemId}`);
    }

    private onOrderItemDeleteHandler = (orderItem: OrderItemModel): void => {
        if (!confirm(textDictionary['confirm.sureQuestion'])) {
            return;
        }

        this.props.orderPageModel!
            .deleteOrderItem(orderItem.id)
            .then(() => this.props.orderPageModel!.fetchData(this.props.match.params.orderId))
            .catch((err) => this.props.clientDataModel!.setPopupContent(
                getAdminSimpleError(err.response.data.message)
            ));
    }

    private onResolveClickHandler = (): void => {
        if (!confirm(textDictionary['confirm.sureQuestion'])) {
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
        if (!confirm(textDictionary['confirm.sureQuestion'])) {
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
                const orderId = order.id!;
                this.props.match.params.orderId = orderId;
                this.props.history.replace(`/bender-root/order/${orderId}`);
                this.props.orderPageModel!.fetchData(orderId);
            })
            .catch((err) => this.props.clientDataModel!.setPopupContent(
                getAdminSimpleError(err.response.data.message)
            ));
    }
}
