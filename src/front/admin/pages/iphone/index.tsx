import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Column} from 'material-table';
import Snackbar from '@material-ui/core/Snackbar';

import {IIphone, IphonePageModel} from 'admin/models/iphone';
import {ProgressBar} from 'admin/components/progress-bar';
import {Table} from 'admin/components/table';
import {TableTitle} from 'admin/components/table-title';
import {PageStatus} from 'admin/libs/types';

import bevis from 'libs/bevis';

import './index.scss';

interface IProps {
    iphonePageModel?: IphonePageModel;
}

const b = bevis('iphone');

@inject('iphonePageModel')
@observer
export class IphonePage extends React.Component<IProps> {
    public componentDidMount(): void {
        this.props.iphonePageModel!.fetchData();
    }

    public render(): React.ReactNode {
        if (this.props.iphonePageModel!.status === PageStatus.LOADING) {
            return <ProgressBar />;
        }

        const tableName = 'IPhones';
        return (
            <div className={b()}>
                <TableTitle value={tableName} />
                <div className={b('container')}>
                    <div className={b('table-container')}>
                        <Table
                            columns={this.getColumns()}
                            rows={this.getRows()}
                            pagination={{
                                currentPage: this.props.iphonePageModel!.offset / this.props.iphonePageModel!.limit + 1,
                                handleChangePage: this.handleChangePage,
                                handleChangeRowsPerPage: this.handleChangeRowsPerPage,
                                rowsPerPage: this.props.iphonePageModel!.limit
                            }}
                            handleDeleteRow={this.handleDeleteRow}
                            handleUpdateRow={this.handleUpdateRow}
                            handleAddRow={this.handleAddRow}
                            options={{actionsColumnIndex: -1}}
                        />
                    </div>
                    <Snackbar
                        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                        key='top_center'
                        autoHideDuration={6000}
                        onClose={this.handleCloseSnackbar}
                        open={this.props.iphonePageModel!.snackbar.open}
                        ContentProps={{'aria-describedby': 'message-id'}}
                        message={<span id='message-id'>{this.props.iphonePageModel!.snackbar.message}</span>}
                    />
                </div>
            </div>
        );
    }

    private getColumns(): Column<IIphone>[] {
        return this.props.iphonePageModel!.tableColumns;
    }

    private getRows(): IIphone[] {
        return this.props.iphonePageModel!.data;
    }

    private handleChangePage = (diff: number): void => {
        this.props.iphonePageModel!.offset += this.props.iphonePageModel!.limit * diff;
        this.props.iphonePageModel!.fetchData();
    }

    private handleChangeRowsPerPage = (rows: number): void => {
        this.props.iphonePageModel!.limit = rows;
        this.props.iphonePageModel!.offset = 0;
        this.props.iphonePageModel!.fetchData();
    }

    private showSnackbar = (err: Error): void => {
        this.props.iphonePageModel!.snackbar.message = err.message;
        this.props.iphonePageModel!.snackbar.open = true;
    }

    private handleDeleteRow = (iphone: IIphone): Promise<void> => {
        return this.props.iphonePageModel!.deleteRow(iphone).catch(this.showSnackbar);
    }

    private handleUpdateRow = (iphone: IIphone): Promise<void> => {
        return this.props.iphonePageModel!.updateRow(iphone).catch(this.showSnackbar);
    }

    private handleAddRow = (iphone: IIphone): Promise<void> => {
        return this.props.iphonePageModel!.insertRow(iphone).catch(this.showSnackbar);
    }

    private handleCloseSnackbar = (): void => {
        this.props.iphonePageModel!.snackbar.open = false;
    }
}
