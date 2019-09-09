import * as React from 'react';

import MaterialTable, {Column, Action} from 'material-table';

import Pagination from 'admin/components/pagination';
import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('table');

interface Props<T extends object> {
    columns: Column<any>[];
    rows: T[];
    rowsPerPage: number;
    currentPage: number;
    handleChangePage: (diff: number) => void;
    handleChangeRowsPerPage: (rows: number) => void;

    handleUpdateRow?: (row: T) => Promise<void>;
    handleDeleteRow?: (row: T) => Promise<void>;
    handleAddRow?: (row: T) => Promise<void>;

    actions?: Action<T>[];
}

export default class Table<T extends Record<string, any>> extends React.Component<Props<T>> {
    render(): React.ReactNode {
        const {columns, rows} = this.props;

        return (
            <div className={b()}>
                <div className={b('container')}>
                    <MaterialTable
                        title=''
                        columns={columns}
                        options={{search: false, paging: false}}
                        data={rows}
                        editable={{
                            ...(this.props.handleAddRow ? {
                                onRowAdd: this.props.handleAddRow
                            } : {}),
                            ...(this.props.handleUpdateRow ? {
                                onRowUpdate: this.props.handleUpdateRow
                            } : {}),
                            ...(this.props.handleDeleteRow ? {
                                onRowDelete: this.props.handleDeleteRow
                            } : {})
                        }}
                        actions={this.props.actions || []}
                    />
                    <Pagination
                        currentPage={this.props.currentPage}
                        rowsPerPage={this.props.rowsPerPage}
                        handleChangePage={(diff: number) => {
                            if (diff === -1 && this.props.currentPage === 1) {
                                return;
                            }

                            if (diff === 1 && this.props.rows.length < this.props.rowsPerPage) {
                                return;
                            }

                            this.props.handleChangePage(diff);
                        }}
                        handleChangeRowsPerPage={this.props.handleChangeRowsPerPage}
                    />
                </div>
            </div>
        );
    }
}
