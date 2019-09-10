import * as React from 'react';
import {RouteComponentProps} from 'react-router';

import bevis from 'libs/bevis';

const b = bevis('order');

import './index.scss';

interface IRouteParams {
    orderId: string;
}

interface IProps extends RouteComponentProps<IRouteParams> {}

export class OrderPage extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <div className={b('text')}>
                        <h1>{this.props.match.params.orderId}</h1>
                    </div>
                </div>
            </div>
        );
    }
}
