import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Column} from 'material-table';
import Snackbar from '@material-ui/core/Snackbar';

import {ClientDataModel} from 'admin/models/client-data';
import {ShopItemPageModel, ShopItem} from 'admin/models/shop-item';
import ProgressBar from 'admin/components/progress-bar';
import Table from 'admin/components/table';
import TableTitle from 'admin/components/table-title';
import bevis from 'libs/bevis';
import {PageStatus} from 'admin/libs/types';

import './index.scss';

interface Props {
    clientDataModel?: ClientDataModel;
    shopItemPageModel?: ShopItemPageModel;
}

const b = bevis('shop-item');

@inject('clientDataModel', 'shopItemPageModel')
@observer
export class ShopItemPage extends React.Component<Props> {
    componentDidMount() {
        this.props.shopItemPageModel!.fetchData();
    }

    getColumns(): Column<any>[] {
        return this.props.shopItemPageModel!.tableColumns;
    }

    getRows(): ShopItem[] {
        return this.props.shopItemPageModel!.data;
    }

    handleChangePage = (diff: number) => {
        this.props.shopItemPageModel!.offset += this.props.shopItemPageModel!.limit * diff;
        this.props.shopItemPageModel!.fetchData();
    }

    handleChangeRowsPerPage = (rows: number) => {
        this.props.shopItemPageModel!.limit = rows;
        this.props.shopItemPageModel!.offset = 0;
        this.props.shopItemPageModel!.fetchData();
    }

    showSnackbar = (err: Error) => {
        this.props.shopItemPageModel!.snackbar.message = err.message;
        this.props.shopItemPageModel!.snackbar.open = true;
    }

    handleDeleteRow = (shopItem: ShopItem): Promise<void> => {
        return this.props.shopItemPageModel!.deleteRow(shopItem).catch(this.showSnackbar);
    }

    handleUpdateRow = (shopItem: ShopItem): Promise<void> => {
        return this.props.shopItemPageModel!.updateRow(shopItem).catch(this.showSnackbar);
    }

    handleAddRow = (shopItem: ShopItem): Promise<void> => {
        return this.props.shopItemPageModel!.insertRow(shopItem).catch(this.showSnackbar);
    }

    handleCloseSnackbar = () => {
        this.props.shopItemPageModel!.snackbar.open = false;
    }

    render(): React.ReactNode {
        if (this.props.shopItemPageModel!.status === PageStatus.LOADING) {
            return <ProgressBar />;
        }

        const tableName = 'Shop items';
        return <div className={b()}>
            <TableTitle value={tableName} />
            <div className={b('container')}>
                <div className={b('table-container')}>
                    <Table
                        columns={this.getColumns()}
                        rows={this.getRows()}
                        rowsPerPage={this.props.shopItemPageModel!.limit}
                        currentPage={this.props.shopItemPageModel!.offset / this.props.shopItemPageModel!.limit + 1}
                        handleChangePage={this.handleChangePage}
                        handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                        handleDeleteRow={this.handleDeleteRow}
                        handleUpdateRow={this.handleUpdateRow}
                        handleAddRow={this.handleAddRow}
                    />
                </div>
                <Snackbar
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    key='top_center'
                    autoHideDuration={6000}
                    onClose={this.handleCloseSnackbar}
                    open={this.props.shopItemPageModel!.snackbar.open}
                    ContentProps={{'aria-describedby': 'message-id'}}
                    message={<span id='message-id'>{this.props.shopItemPageModel!.snackbar.message}</span>}
                />
            </div>
        </div>;
    }
}
