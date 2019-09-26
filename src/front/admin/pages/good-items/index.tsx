import * as React from 'react';
import {inject, observer} from 'mobx-react';

import bevis from '@denstep-core/libs/bevis';
import {PageStatus} from '@denstep-core/libs/types';
import {ScreenLocker} from '@denstep-core/components/screen-locker';
import {Pagination} from '@denstep-core/components/pagination';
import {Paper} from '@denstep-core/components/paper';
import {ClientDataModel} from 'admin/models/client-data';
import {Bender} from 'admin/components/bender';
import {GoodItemsPageModel} from 'admin/models/good-items';

import './index.scss';

interface IProps {
    clientDataModel?: ClientDataModel;
    goodItemsPageModel?: GoodItemsPageModel;
}

const b = bevis('good-items');

@inject('clientDataModel', 'goodItemsPageModel')
@observer
export class GoodItemsPage extends React.Component<IProps> {

    public componentDidMount(): void {
        this.props.goodItemsPageModel!.fetchData();
    }

    public render(): React.ReactNode {
        if (this.props.goodItemsPageModel!.status === PageStatus.LOADING) {
            return <ScreenLocker preset='#blue'/>;
        }

        return (
            <div className={b()}>
                <Bender/>
                <div className={b('container')}>
                    <Paper>
                        <Pagination
                            limit={this.props.goodItemsPageModel!.limit}
                            offset={this.props.goodItemsPageModel!.offset}
                            total={this.props.goodItemsPageModel!.total}
                            onChange={this.onPaginationChageHandler}
                        />
                    </Paper>
                </div>
            </div>
        );
    }

    private onPaginationChageHandler = (offset: number): void => {
        this.props.goodItemsPageModel!.offset = offset;
    }
}
