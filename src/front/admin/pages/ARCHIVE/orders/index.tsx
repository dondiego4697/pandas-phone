import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Column} from 'material-table';
import {RouteComponentProps} from 'react-router';
import {Snackbar} from '@material-ui/core';

import {IOrder, OrdersPageModel} from 'admin/models/ARCHIVE/orders';
import {ProgressBar} from 'admin/components/progress-bar';
import {Table} from 'admin/components/table';
import {TableTitle} from 'admin/components/table-title';
import bevis from '@denstep-core/libs/bevis';
import {PageStatus} from '@denstep-core/libs/types';

import './index.scss';

interface IProps extends RouteComponentProps {
    ordersPageModel?: OrdersPageModel;
}

const b = bevis('orders');

@inject('ordersPageModel')
@observer
export class OrdersPage extends React.Component<IProps> {
    public componentDidMount(): void {
        this.props.ordersPageModel!.fetchData();
    }

    public render(): React.ReactNode {
        if (this.props.ordersPageModel!.status === PageStatus.LOADING) {
            return <ProgressBar />;
        }

        const tableName = 'Orders';
        return (
            <div className={b()}>
                <TableTitle value={tableName} />
                <div className={b('container')}>
                    <div className={b('table-container')}>
                        <Table
                            columns={this.getColumns()}
                            rows={this.getRows()}
                            pagination={{
                                currentPage: this.props.ordersPageModel!.offset /
                                    this.props.ordersPageModel!.limit + 1,
                                handleChangePage: this.handleChangePage,
                                handleChangeRowsPerPage: this.handleChangeRowsPerPage,
                                rowsPerPage: this.props.ordersPageModel!.limit
                            }}
                            handleUpdateRow={this.handleUpdateRow}
                            handleAddRow={this.handleAddRow}
                            actions={[
                                {
                                    icon: 'info',
                                    onClick: this.handleDetailsClick,
                                    tooltip: 'Info',
                                }
                            ]}
                            options={{actionsColumnIndex: -1}}
                        />
                    </div>
                    <Snackbar
                        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                        key='top_center'
                        autoHideDuration={6000}
                        onClose={this.handleCloseSnackbar}
                        open={this.props.ordersPageModel!.snackbar.open}
                        ContentProps={{'aria-describedby': 'message-id'}}
                        message={<span id='message-id'>{this.props.ordersPageModel!.snackbar.message}</span>}
                    />
                </div>
            </div>
        );
    }

    private getColumns(): Column<IOrder>[] {
        return this.props.ordersPageModel!.tableColumns;
    }

    private getRows(): IOrder[] {
        return this.props.ordersPageModel!.data;
    }

    private handleChangePage = (diff: number): void => {
        this.props.ordersPageModel!.offset += this.props.ordersPageModel!.limit * diff;
        this.props.ordersPageModel!.fetchData();
    }

    private handleChangeRowsPerPage = (rows: number): void => {
        this.props.ordersPageModel!.limit = rows;
        this.props.ordersPageModel!.offset = 0;
        this.props.ordersPageModel!.fetchData();
    }

    private showSnackbar = (err: Error): void => {
        this.props.ordersPageModel!.snackbar.message = err.message;
        this.props.ordersPageModel!.snackbar.open = true;
    }

    private handleUpdateRow = (order: IOrder): Promise<void> => {
        return this.props.ordersPageModel!.updateRow(order).catch(this.showSnackbar);
    }

    private handleAddRow = (order: IOrder): Promise<void> => {
        return this.props.ordersPageModel!.insertRow(order).catch(this.showSnackbar);
    }

    private handleDetailsClick = (_: any, order: any): void => {
        delete order.tableData;

        this.props.history.push(`/bender-root/order/${order.id}`);
    }

    private handleCloseSnackbar = (): void => {
        this.props.ordersPageModel!.snackbar.open = false;
    }
}
