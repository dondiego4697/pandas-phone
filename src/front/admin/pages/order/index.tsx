import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {inject, observer} from 'mobx-react';
import {Column} from 'material-table';
import {Button, Snackbar} from '@material-ui/core';

import {OrderPageModel} from 'admin/models/order';
import {TableTitle} from 'admin/components/table-title';
import {Table} from 'admin/components/table';
import {ProgressBar} from 'admin/components/progress-bar';
import {NotFoundPage} from 'admin/pages/not-found';
import {IAirpodFull} from 'admin/models/airpods';
import {IIphoneFull} from 'admin/models/iphones';
import {PageStatus} from 'libs/types';
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
                            title='iPhones'
                            columns={this.getColumns().iphones}
                            rows={this.getRows().iphones}
                            handleDeleteRow={this.handleDeleteIphoneRow}
                            handleAddRow={this.handleAddIphoneRow}
                            handleUpdateRow={this.handleUpdateIphoneRow}
                            options={{actionsColumnIndex: -1}}
                        />
                        <Table
                            className={b('airpods-table')}
                            title='airPods'
                            columns={this.getColumns().airpods}
                            rows={this.getRows().airpods}
                            handleDeleteRow={this.handleDeleteAirpodRow}
                            handleAddRow={this.handleAddAirpodRow}
                            handleUpdateRow={this.handleUpdateAirpodRow}
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
                                Прозвонен
                            </Button>
                            <Button
                                variant='contained'
                                className={b('button-sell')}
                                onClick={this.handleSell}
                            >
                                Продано
                            </Button>
                            <Button
                                variant='contained'
                                className={b('button-reject')}
                                onClick={this.handleReject}
                            >
                                Отказ
                            </Button>
                        </div>
                        <div className={b('result-price')}>
                            <h1>{`Result: ${this.props.orderPageModel!.totalPrice}`}</h1>
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
            .then(() => this.props.history.replace('/bender-root/orders'))
            .catch(this.showSnackbar);
    }

    private handleReject = () => {
        this.props.orderPageModel!.updateStatus(this.props.match.params.orderId, 'reject')
            .then(() => this.props.history.replace('/bender-root/orders'))
            .catch(this.showSnackbar);
    }

    private getColumns(): {
        airpods: Column<IAirpodFull>[];
        iphones: Column<IIphoneFull>[];
    } {
        return {
            airpods: this.props.orderPageModel!.tableAipodColumns,
            iphones: this.props.orderPageModel!.tableIphoneColumns
        };
    }

    private getRows(): {
        airpods: IAirpodFull[];
        iphones: IIphoneFull[];
    } {
        return {
            airpods: this.props.orderPageModel!.airpodsData,
            iphones: this.props.orderPageModel!.iphonesData
        };
    }

    private showSnackbar = (err: Error): void => {
        this.props.orderPageModel!.snackbar.message = err.message;
        this.props.orderPageModel!.snackbar.open = true;
    }

    private handleAddAirpodRow = (airpod: IAirpodFull): Promise<void> => {
        return this.props.orderPageModel!.insertAirpodRow(this.props.match.params.orderId, airpod)
            .catch(this.showSnackbar);
    }

    private handleUpdateAirpodRow = (airpod: IAirpodFull): Promise<void> => {
        return this.props.orderPageModel!.updateAirpodRow(this.props.match.params.orderId, airpod)
            .catch(this.showSnackbar);
    }

    private handleAddIphoneRow = (iphone: IIphoneFull): Promise<void> => {
        return this.props.orderPageModel!.insertIphoneRow(this.props.match.params.orderId, iphone)
            .catch(this.showSnackbar);
    }

    private handleUpdateIphoneRow = (iphone: IIphoneFull): Promise<void> => {
        return this.props.orderPageModel!.updateIphoneRow(this.props.match.params.orderId, iphone)
            .catch(this.showSnackbar);
    }

    private handleDeleteAirpodRow = (airpod: IAirpodFull): Promise<void> => {
        return this.props.orderPageModel!.deleteAirpodRow(this.props.match.params.orderId, airpod)
            .catch(this.showSnackbar);
    }

    private handleDeleteIphoneRow = (iphone: IIphoneFull): Promise<void> => {
        return this.props.orderPageModel!.deleteIphoneRow(this.props.match.params.orderId, iphone)
            .catch(this.showSnackbar);
    }

    private handleCloseSnackbar = (): void => {
        this.props.orderPageModel!.snackbar.open = false;
    }
}
