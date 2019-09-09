import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Column} from 'material-table';

import {ClientDataModel} from 'admin/models/client-data';
import {Order, OrderPageModel} from 'admin/models/order';
import ProgressBar from 'admin/components/progress-bar';
import Table from 'admin/components/table';
import TableTitle from 'admin/components/table-title';
import bevis from 'libs/bevis';
import {PageStatus} from 'admin/libs/types';

import './index.scss';

interface Props {
    clientDataModel?: ClientDataModel;
    orderPageModel?: OrderPageModel;
}

const b = bevis('order');

@inject('clientDataModel', 'orderPageModel')
@observer
export class OrderPage extends React.Component<Props> {
    componentDidMount() {
        this.props.orderPageModel!.fetchData();
    }

    getColumns(): Column<any>[] {
        return this.props.orderPageModel!.tableColumns;
    }

    getRows(): Order[] {
        return this.props.orderPageModel!.data;
    }

    handleChangePage = (diff: number) => {
        this.props.orderPageModel!.offset += this.props.orderPageModel!.limit * diff;
        this.props.orderPageModel!.fetchData();
    }

    handleChangeRowsPerPage = (rows: number) => {
        this.props.orderPageModel!.limit = rows;
        this.props.orderPageModel!.offset = 0;
        this.props.orderPageModel!.fetchData();
    }

    showSnackbar = (err: Error) => {
        this.props.orderPageModel!.snackbar.message = err.message;
        this.props.orderPageModel!.snackbar.open = true;
    }

    handleUpdateRow = (order: Order): Promise<void> => {
        return this.props.orderPageModel!.updateRow(order).catch(this.showSnackbar);
    }

    handleSellClick = (_: any, order: any) => {
        delete order.tableData;

        this.props.orderPageModel!.sell(order);
    }

    render(): React.ReactNode {
        if (this.props.orderPageModel!.status === PageStatus.LOADING) {
            return <ProgressBar />;
        }

        const tableName = 'Orders';
        return <div className={b()}>
            <TableTitle value={tableName} />
            <div className={b('container')}>
                <div className={b('table-container')}>
                    <Table
                        columns={this.getColumns()}
                        rows={this.getRows()}
                        rowsPerPage={this.props.orderPageModel!.limit}
                        currentPage={this.props.orderPageModel!.offset / this.props.orderPageModel!.limit + 1}
                        handleChangePage={this.handleChangePage}
                        handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                        handleUpdateRow={this.handleUpdateRow}
                        actions={[
                            {
                                icon: 'save',
                                tooltip: 'Sell it',
                                onClick: this.handleSellClick
                            }
                        ]}
                    />
                </div>
            </div>
        </div>;
    }
}
