import * as React from 'react';

import BaseTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Pagination from 'admin/components/pagination';
import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('table');

interface Props<T, M extends string> {
    columns: M[];
    rows: T[];
    rowsPerPage: number;
    currentPage: number;
    handleChangePage: (diff: number) => void;
    handleChangeRowsPerPage: (rows: number) => void;
}

export default class Table<T extends Record<string, any>, M extends string> extends React.Component<Props<T, M>> {
    render(): React.ReactNode {
        const {columns, rows} = this.props;

        return (
            <div className={b()}>
                <div className={b('container')}>
                    <BaseTable stickyHeader>
                        <TableHead>
                            <TableRow>
                                {columns.map((column, i) => (
                                    <TableCell key={`column-${i}`}>
                                        {column}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, i) => {
                                return (
                                    <TableRow hover key={`table-row-${i}`}>
                                        {columns.map((column, j) => {
                                            const value = row[column];
                                            return (
                                                <TableCell key={`table-cell-${i}-${j}`}>
                                                    {value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </BaseTable>
                </div>
                <Pagination
                    currentPage={this.props.currentPage}
                    rowsPerPage={this.props.rowsPerPage}
                    handleChangePage={this.props.handleChangePage}
                    handleChangeRowsPerPage={this.props.handleChangeRowsPerPage}
                />
            </div>
        );
    }
}
