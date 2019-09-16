import * as React from 'react';
import {inject, observer} from 'mobx-react';

import {MainPageModel} from 'client/models/main';
import bevis from 'libs/bevis';

import './index.scss';

interface IProps {
    mainPageModel?: MainPageModel;
}

const b = bevis('main');

@inject('mainPageModel')
@observer
export class MainPage extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>

                </div>
            </div>
        );
    }
}
