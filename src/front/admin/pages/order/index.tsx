import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {inject, observer} from 'mobx-react';
import {Column} from 'material-table';
import {Button, Snackbar} from '@material-ui/core';

import {OrderPageModel, IOrderItem} from 'admin/models/order';
import {TableTitle} from 'admin/components/table-title';
import {Table} from 'admin/components/table';
import {ProgressBar} from 'admin/components/progress-bar';
import {PageStatus} from 'admin/libs/types';
import {NotFoundPage} from 'admin/pages/not-found';
import bevis from 'libs/bevis';

const b = bevis('order');

import './index.scss';

interface IRouteParams {
    orderId: string;
}

interface IProps extends RouteComponentProps<IRouteParams> {
    orderPageModel?: OrderPageModel;
}

@inject('orderPageModel')
@observer
export class OrderPage extends React.Component<IProps> {
    public componentDidMount(): void {
        this.props.orderPageModel!.fetchData(this.props.match.params.orderId);
    }

    public render(): React.ReactNode {
        if (this.props.orderPageModel!.status === PageStatus.LOADING) {
            return <ProgressBar />;
        }

        if (this.props.orderPageModel!.notFound) {
            return <NotFoundPage />;
        }

        const tableName = `[${this.props.orderPageModel!.orderData!.status}] ` +
            `${this.props.orderPageModel!.orderData!.customer_name}, ` +
            `${this.props.orderPageModel!.orderData!.customer_phone}`;

        return (
            <div className={b()}>
                <TableTitle value={tableName} />
                <div className={b('container')}>
                    <div className={b('table-container')}>
                        <Table
                            columns={this.getColumns()}
                            rows={this.getRows()}
                            handleDeleteRow={this.handleDeleteRow}
                            handleUpdateRow={this.handleUpdateRow}
                            handleAddRow={this.handleAddRow}
                            options={{actionsColumnIndex: -1}}
                        />
                    </div>
                    <div className={b('result-container')}>
                        <div className={b('result-controls')}>
                            <Button
                                variant='contained'
                                className={b('button-called')}
                                onClick={this.handleCalled}
                            >
                                Called
                            </Button>
                            <Button
                                variant='contained'
                                className={b('button-sell')}
                                onClick={this.handleSell}
                            >
                                Sell
                            </Button>
                            <Button
                                variant='contained'
                                className={b('button-reject')}
                                onClick={this.handleReject}
                            >
                                Reject
                            </Button>
                        </div>
                        <div className={b('result-price')}>
                            <h1
                                dangerouslySetInnerHTML={{
                                    __html: `Result: ${this.props.orderPageModel!.totalPrice} \u20BD`
                                }}
                            />
                        </div>
                    </div>
                    <Snackbar
                        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                        key='top_center'
                        autoHideDuration={6000}
                        onClose={this.handleCloseSnackbar}
                        open={this.props.orderPageModel!.snackbar.open}
                        ContentProps={{'aria-describedby': 'message-id'}}
                        message={<span id='message-id'>{this.props.orderPageModel!.snackbar.message}</span>}
                    />
                </div>
            </div>
        );
    }

    private handleCalled = () => {
        this.props.orderPageModel!.updateStatus(this.props.match.params.orderId, 'called')
            .then(() => this.props.orderPageModel!.orderData!.status = 'called')
            .catch(this.showSnackbar);
    }

    private handleSell = () => {
        this.props.orderPageModel!.updateStatus(this.props.match.params.orderId, 'bought')
            .then(() => this.props.history.replace('/bender-root/order'))
            .catch(this.showSnackbar);
    }

    private handleReject = () => {
        this.props.orderPageModel!.updateStatus(this.props.match.params.orderId, 'reject')
            .then(() => this.props.history.replace('/bender-root/order'))
            .catch(this.showSnackbar);
    }

    private getColumns(): Column<IOrderItem>[] {
        return this.props.orderPageModel!.tableColumns;
    }

    private getRows(): IOrderItem[] {
        return this.props.orderPageModel!.data;
    }

    private showSnackbar = (err: Error): void => {
        this.props.orderPageModel!.snackbar.message = err.message;
        this.props.orderPageModel!.snackbar.open = true;
    }

    private handleDeleteRow = (orderItem: IOrderItem): Promise<void> => {
        return this.props.orderPageModel!.deleteRow(orderItem).catch(this.showSnackbar);
    }

    private handleUpdateRow = (orderItem: IOrderItem): Promise<void> => {
        return this.props.orderPageModel!.updateRow(orderItem).catch(this.showSnackbar);
    }

    private handleAddRow = (orderItem: IOrderItem): Promise<void> => {
        return this.props.orderPageModel!.insertRow(this.props.match.params.orderId, orderItem)
            .catch(this.showSnackbar);
    }

    private handleCloseSnackbar = (): void => {
        this.props.orderPageModel!.snackbar.open = false;
    }
}
