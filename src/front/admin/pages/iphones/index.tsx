import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Column} from 'material-table';
import Snackbar from '@material-ui/core/Snackbar';

import {IIphone, IphonesPageModel} from 'admin/models/iphones';
import {ProgressBar} from 'admin/components/progress-bar';
import {Table} from 'admin/components/table';
import {TableTitle} from 'admin/components/table-title';
import {PageStatus} from 'admin/libs/types';

import bevis from 'libs/bevis';

import './index.scss';

interface IProps {
    iphonesPageModel?: IphonesPageModel;
}

const b = bevis('iphone');

@inject('iphonesPageModel')
@observer
export class IphonesPage extends React.Component<IProps> {
    public componentDidMount(): void {
        this.props.iphonesPageModel!.fetchData();
    }

    public render(): React.ReactNode {
        if (this.props.iphonesPageModel!.status === PageStatus.LOADING) {
            return <ProgressBar />;
        }

        const tableName = 'iPhones';
        return (
            <div className={b()}>
                <TableTitle value={tableName} />
                <div className={b('container')}>
                    <div className={b('table-container')}>
                        <Table
                            columns={this.getColumns()}
                            rows={this.getRows()}
                            pagination={{
                                currentPage: this.props.iphonesPageModel!.offset /
                                    this.props.iphonesPageModel!.limit + 1,
                                handleChangePage: this.handleChangePage,
                                handleChangeRowsPerPage: this.handleChangeRowsPerPage,
                                rowsPerPage: this.props.iphonesPageModel!.limit
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
                        open={this.props.iphonesPageModel!.snackbar.open}
                        ContentProps={{'aria-describedby': 'message-id'}}
                        message={<span id='message-id'>{this.props.iphonesPageModel!.snackbar.message}</span>}
                    />
                </div>
            </div>
        );
    }

    private getColumns(): Column<IIphone>[] {
        return this.props.iphonesPageModel!.tableColumns;
    }

    private getRows(): IIphone[] {
        return this.props.iphonesPageModel!.data;
    }

    private handleChangePage = (diff: number): void => {
        this.props.iphonesPageModel!.offset += this.props.iphonesPageModel!.limit * diff;
        this.props.iphonesPageModel!.fetchData();
    }

    private handleChangeRowsPerPage = (rows: number): void => {
        this.props.iphonesPageModel!.limit = rows;
        this.props.iphonesPageModel!.offset = 0;
        this.props.iphonesPageModel!.fetchData();
    }

    private showSnackbar = (err: Error): void => {
        this.props.iphonesPageModel!.snackbar.message = err.message;
        this.props.iphonesPageModel!.snackbar.open = true;
    }

    private handleDeleteRow = (iphone: IIphone): Promise<void> => {
        return this.props.iphonesPageModel!.deleteRow(iphone).catch(this.showSnackbar);
    }

    private handleUpdateRow = (iphone: IIphone): Promise<void> => {
        return this.props.iphonesPageModel!.updateRow(iphone).catch(this.showSnackbar);
    }

    private handleAddRow = (iphone: IIphone): Promise<void> => {
        return this.props.iphonesPageModel!.insertRow(iphone).catch(this.showSnackbar);
    }

    private handleCloseSnackbar = (): void => {
        this.props.iphonesPageModel!.snackbar.open = false;
    }
}
