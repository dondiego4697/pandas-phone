import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {Column} from 'material-table';
import Snackbar from '@material-ui/core/Snackbar';

import {ClientDataModel} from 'admin/models/client-data';
import {GoodPattern, GoodPatternPageModel} from 'admin/models/good-pattern';
import ProgressBar from 'admin/components/progress-bar';
import Table from 'admin/components/table';
import TableTitle from 'admin/components/table-title';
import {PageStatus} from 'admin/libs/types';
import bevis from 'libs/bevis';

import './index.scss';

interface Props {
    clientDataModel?: ClientDataModel;
    goodPatternPageModel?: GoodPatternPageModel;
}

const b = bevis('good-pattern');

@inject('clientDataModel', 'goodPatternPageModel')
@observer
export class GoodPatternPage extends React.Component<Props> {
    patternPageBuff?: GoodPattern;

    componentDidMount() {
        this.props.goodPatternPageModel!.fetchData();
    }

    getColumns(): Column<any>[] {
        return this.props.goodPatternPageModel!.tableColumns.map((columnName) => {
            return {
                title: columnName,
                field: columnName,
                ...(columnName === 'memory_capacity' ? {type: 'numeric'} : {}),
                ...(columnName === 'id' ? {editable: 'never'} : {})
            };
        });
    }

    getRows(): GoodPattern[] {
        return this.props.goodPatternPageModel!.data;
    }

    handleChangePage = (diff: number) => {
        this.props.goodPatternPageModel!.offset += this.props.goodPatternPageModel!.limit * diff;
        this.props.goodPatternPageModel!.fetchData();
    }

    handleChangeRowsPerPage = (rows: number) => {
        this.props.goodPatternPageModel!.limit = rows;
        this.props.goodPatternPageModel!.offset = 0;
        this.props.goodPatternPageModel!.fetchData();
    }

    showSnackbar = (err: Error) => {
        this.props.goodPatternPageModel!.snackbar.message = err.message;
        this.props.goodPatternPageModel!.snackbar.open = true;
    }

    handleDeleteRow = (goodPattern: GoodPattern): Promise<void> => {
        return this.props.goodPatternPageModel!.deleteRow(goodPattern).catch(this.showSnackbar);
    }

    handleUpdateRow = (goodPattern: GoodPattern): Promise<void> => {
        return this.props.goodPatternPageModel!.updateRow(goodPattern).catch(this.showSnackbar);
    }

    handleAddRow = (goodPattern: GoodPattern): Promise<void> => {
        return this.props.goodPatternPageModel!.insertRow(goodPattern).catch(this.showSnackbar);
    }

    handleCloseSnackbar = () => {
        this.props.goodPatternPageModel!.snackbar.open = false;
    }

    render(): React.ReactNode {
        if (this.props.goodPatternPageModel!.status === PageStatus.LOADING) {
            return <ProgressBar />;
        }

        const tableName = 'Good pattern';
        return <div className={b()}>
            <TableTitle value={tableName} />
            <div className={b('container')}>
                <div className={b('table-container')}>
                    <Table
                        columns={this.getColumns()}
                        rows={this.getRows()}
                        rowsPerPage={this.props.goodPatternPageModel!.limit}
                        currentPage={this.props.goodPatternPageModel!.offset / this.props.goodPatternPageModel!.limit + 1}
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
                    open={this.props.goodPatternPageModel!.snackbar.open}
                    ContentProps={{'aria-describedby': 'message-id'}}
                    message={<span id='message-id'>{this.props.goodPatternPageModel!.snackbar.message}</span>}
                />
            </div>
        </div>;
    }
}
