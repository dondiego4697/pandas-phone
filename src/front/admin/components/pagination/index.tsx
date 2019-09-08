import * as React from 'react';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('pagination');

interface Props {
    rowsPerPage: number;
    currentPage: number;
    handleChangePage: (diff: number) => void;
    handleChangeRowsPerPage: (rows: number) => void;
}

export default class Pagination extends React.Component<Props> {
    handleClickBack = () => this.props.handleChangePage(-1);
    handleClickNext = () => this.props.handleChangePage(1);

    render(): React.ReactNode {
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
                    <Button color='primary' size='small' variant='contained' onClick={this.handleClickBack}>
                        Back
                    </Button>
                    <p className={b('page')}>{this.props.currentPage}</p>
                    <Button color='primary' size='small' variant='contained' onClick={this.handleClickNext}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }
}
