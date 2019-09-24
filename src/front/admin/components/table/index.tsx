import * as React from 'react';

import MaterialTable, {Column, Action, Options} from 'material-table';

import {Pagination} from 'admin/components/pagination';
import bevis from '@denstep/libs/bevis';

const b = bevis('table');

interface IPagination {
    rowsPerPage: number;
    currentPage: number;
    handleChangePage: (diff: number) => void;
    handleChangeRowsPerPage: (rows: number) => void;
}

interface IProps<T extends object> {
    columns: Column<any>[];
    rows: T[];

    pagination?: IPagination;

    handleUpdateRow?: (row: T) => Promise<void>;
    handleDeleteRow?: (row: T) => Promise<void>;
    handleAddRow?: (row: T) => Promise<void>;

    actions?: Action<T>[];
    options?: Options;

    title?: string;
    className?: string;
}

export class Table<T extends Record<string, any>> extends React.Component<IProps<T>> {
    public render(): React.ReactNode {
        const {columns, rows} = this.props;

        return (
            <div className={b()}>
                <div className={`${b('container')} ${this.props.className || ''}`}>
                    <MaterialTable
                        title={this.props.title || ''}
                        columns={columns}
                        options={{
                            paging: false,
                            search: false,
                            ...(this.props.options || {})
                        }}
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
                    {this.props.pagination && <Pagination
                        currentPage={this.props.pagination!.currentPage}
                        rowsPerPage={this.props.pagination!.rowsPerPage}
                        handleChangePage={(diff: number) => {
                            if (diff === -1 && this.props.pagination!.currentPage === 1) {
                                return;
                            }

                            if (diff === 1 && this.props.rows.length < this.props.pagination!.rowsPerPage) {
                                return;
                            }

                            this.props.pagination!.handleChangePage(diff);
                        }}
                        handleChangeRowsPerPage={this.props.pagination!.handleChangeRowsPerPage}
                    />}
                </div>
            </div>
        );
    }
}
