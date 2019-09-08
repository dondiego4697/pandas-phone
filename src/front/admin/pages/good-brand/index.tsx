import * as React from 'react';
import {inject, observer} from 'mobx-react';

import {ClientDataModel} from 'admin/models/client-data';
import {GoodBrandPageModel, GoodBrand} from 'admin/models/good-brand';
import ProgressBar from 'admin/components/progress-bar';
import Table from 'admin/components/table';
import TableTitle from 'admin/components/table-title';
import bevis from 'libs/bevis';
import {PageStatus} from 'admin/libs/types';

import './index.scss';

interface Props {
    clientDataModel?: ClientDataModel;
    goodBrandPageModel?: GoodBrandPageModel;
}

const b = bevis('good-brand');

@inject('clientDataModel', 'goodBrandPageModel')
@observer
export default class GoodBrandPage extends React.Component<Props> {
    componentDidMount() {
        this.props.goodBrandPageModel!.fetchData();
    }

    getColumns(): string[] {
        return this.props.goodBrandPageModel!.tableColumns;
    }

    getRows(): GoodBrand[] {
        return this.props.goodBrandPageModel!.data;
    }

    handleChangePage = (diff: number) => {
        if (diff === -1 && this.props.goodBrandPageModel!.offset === 0) {
            return;
        }

        if (diff === 1 && this.props.goodBrandPageModel!.data.length === 0) {
            return;
        }

        this.props.goodBrandPageModel!.offset += this.props.goodBrandPageModel!.limit * diff;
        this.props.goodBrandPageModel!.fetchData();
    }

    handleChangeRowsPerPage = (rows: number) => {
        this.props.goodBrandPageModel!.limit = rows;
        this.props.goodBrandPageModel!.offset = 0;
        this.props.goodBrandPageModel!.fetchData();
    }

    render(): React.ReactNode {
        if (this.props.goodBrandPageModel!.status === PageStatus.LOADING) {
            return <ProgressBar />;
        }

        const tableName = 'Good brand';
        return <div className={b()}>
            <TableTitle value={tableName} />
            <div className={b('container')}>
                <div className={b('table-container')}>
                    <Table
                        columns={this.getColumns()}
                        rows={this.getRows()}
                        rowsPerPage={this.props.goodBrandPageModel!.limit}
                        currentPage={this.props.goodBrandPageModel!.offset / this.props.goodBrandPageModel!.limit + 1}
                        handleChangePage={this.handleChangePage}
                        handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </div>
            </div>
        </div>;
    }
}
