import * as React from 'react';
import {inject} from 'mobx-react';

import bevis from '@denstep-core/libs/bevis';
import {PageStatus} from '@denstep-core/libs/types';
import {ClientDataModel} from 'admin/models/client-data';
import {Bender} from 'admin/components/bender';
import {GoodItemsPageModel} from 'admin/models/good-items';
import {ProgressBar} from 'admin/components/progress-bar';

import './index.scss';

interface IProps {
    clientDataModel?: ClientDataModel;
    goodItemsPageModel?: GoodItemsPageModel;
}

const b = bevis('good-items');

@inject('clientDataModel', 'goodItemsPageModel')
export class GoodItemsPage extends React.Component<IProps> {

    public componentDidMount(): void {
        this.props.goodItemsPageModel!.fetchData();
    }

    public render(): React.ReactNode {
        if (this.props.goodItemsPageModel!.status === PageStatus.LOADING) {
            return <ProgressBar/>;
        }

        return (
            <div className={b()}>
                <Bender/>
                <div className={b('container')}>

                </div>
            </div>
        );
    }
}
