import * as React from 'react';
import {inject} from 'mobx-react';

import bevis from '@denstep-core/libs/bevis';
import {Text} from '@denstep-core/components/text';
import {ClientDataModel} from 'admin/models/client-data';

import './index.scss';

interface IProps {
    clientDataModel?: ClientDataModel;
}

const b = bevis('forbidden-page');

@inject('clientDataModel')
export class ForbiddenPage extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('auth-container')}>
                    <img src='/public/imgs/bender-root/forbidden.png'/>
                    <Text
                        text='Forbidden'
                        colorPreset='dark'
                        typePreset='header'
                    />
                    <div className={b('login-button')}>
                        <a
                            className={b('login-yandex')}
                            href={this.props.clientDataModel!.authUrl}
                        >
                            Enter via Yandex
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
