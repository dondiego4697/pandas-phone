import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/ChevronLeft';
import NextIcon from '@material-ui/icons/ChevronRight';

import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('pagination');

interface IProps {
    rowsPerPage: number;
    currentPage: number;
    handleChangePage: (diff: number) => void;
    handleChangeRowsPerPage: (rows: number) => void;
}

export class Pagination extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <p>Rows per page:</p>
                    <FormControl>
                        <Select
                            value={this.props.rowsPerPage}
                            onChange={(event: React.ChangeEvent<any>) => {
                                this.props.handleChangeRowsPerPage(event.target.value);
                            }}
                        >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                        </Select>
                    </FormControl>
                    <IconButton onClick={this.handleClickBack}>
                        <BackIcon />
                    </IconButton>
                    <p className={b('page')}>{this.props.currentPage}</p>
                    <IconButton onClick={this.handleClickNext}>
                        <NextIcon/>
                    </IconButton>
                </div>
            </div>
        );
    }

    private handleClickBack = () => this.props.handleChangePage(-1);
    private handleClickNext = () => this.props.handleChangePage(1);
}
