import * as React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router';

import {MainPageModel} from 'client/models/main';
import {ClientDataModel} from 'client/models/client-data';

import bevis from '@denstep-core/libs/bevis';
import {PageStatus} from '@denstep-core/libs/types';
import {ScreenLocker} from '@denstep-core/components/screen-locker';

import './index.scss';

interface IProps extends RouteComponentProps<{}> {
    clientDataModel?: ClientDataModel;
    mainPageModel?: MainPageModel;
}

const b = bevis('main-page');

@inject('mainPageModel', 'clientDataModel')
@observer
export class MainPage extends React.Component<IProps> {
    public componentDidMount(): void {
        this.props.mainPageModel!.fetchData();
    }

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <ScreenLocker
                    transparent={true}
                    show={this.props.mainPageModel!.status === PageStatus.LOADING}
                />
            </div>
        );
    }
}
