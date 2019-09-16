import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Column} from 'material-table';
import Snackbar from '@material-ui/core/Snackbar';

import {IAirpod, AirpodsPageModel} from 'admin/models/airpods';
import {ProgressBar} from 'admin/components/progress-bar';
import {Table} from 'admin/components/table';
import {TableTitle} from 'admin/components/table-title';
import {PageStatus} from 'libs/types';

import bevis from 'libs/bevis';

import './index.scss';

interface IProps {
    airpodsPageModel?: AirpodsPageModel;
}

const b = bevis('airpods');

@inject('airpodsPageModel')
@observer
export class AirpodsPage extends React.Component<IProps> {
    public componentDidMount(): void {
        this.props.airpodsPageModel!.fetchData();
    }

    public render(): React.ReactNode {
        if (this.props.airpodsPageModel!.status === PageStatus.LOADING) {
            return <ProgressBar />;
        }

        const tableName = 'AirPods';
        return (
            <div className={b()}>
                <TableTitle value={tableName} />
                <div className={b('container')}>
                    <div className={b('table-container')}>
                        <Table
                            columns={this.getColumns()}
                            rows={this.getRows()}
                            pagination={{
                                currentPage: this.props.airpodsPageModel!.offset /
                                this.props.airpodsPageModel!.limit + 1,
                                handleChangePage: this.handleChangePage,
                                handleChangeRowsPerPage: this.handleChangeRowsPerPage,
                                rowsPerPage: this.props.airpodsPageModel!.limit
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
                        open={this.props.airpodsPageModel!.snackbar.open}
                        ContentProps={{'aria-describedby': 'message-id'}}
                        message={<span id='message-id'>{this.props.airpodsPageModel!.snackbar.message}</span>}
                    />
                </div>
            </div>
        );
    }

    private getColumns(): Column<IAirpod>[] {
        return this.props.airpodsPageModel!.tableColumns;
    }

    private getRows(): IAirpod[] {
        return this.props.airpodsPageModel!.data;
    }

    private handleChangePage = (diff: number): void => {
        this.props.airpodsPageModel!.offset += this.props.airpodsPageModel!.limit * diff;
        this.props.airpodsPageModel!.fetchData();
    }

    private handleChangeRowsPerPage = (rows: number): void => {
        this.props.airpodsPageModel!.limit = rows;
        this.props.airpodsPageModel!.offset = 0;
        this.props.airpodsPageModel!.fetchData();
    }

    private showSnackbar = (err: Error): void => {
        this.props.airpodsPageModel!.snackbar.message = err.message;
        this.props.airpodsPageModel!.snackbar.open = true;
    }

    private handleDeleteRow = (airpods: IAirpod): Promise<void> => {
        return this.props.airpodsPageModel!.deleteRow(airpods).catch(this.showSnackbar);
    }

    private handleUpdateRow = (airpods: IAirpod): Promise<void> => {
        return this.props.airpodsPageModel!.updateRow(airpods).catch(this.showSnackbar);
    }

    private handleAddRow = (airpods: IAirpod): Promise<void> => {
        return this.props.airpodsPageModel!.insertRow(airpods).catch(this.showSnackbar);
    }

    private handleCloseSnackbar = (): void => {
        this.props.airpodsPageModel!.snackbar.open = false;
    }
}
