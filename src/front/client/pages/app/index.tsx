import * as React from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter, RouteComponentProps} from 'react-router';

import bevis from 'libs/bevis';
import {ClientDataModel} from 'client/models/client-data';

import './index.scss';

interface IProps extends RouteComponentProps {
    children: React.ReactNode;
    clientDataModel?: ClientDataModel;
}

const b = bevis('app');

@inject('clientDataModel')
@observer
class App extends React.Component<IProps, {}> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                {this.props.children}
            </div>
        );
    }
}

export default withRouter(App);
