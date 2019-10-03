import * as React from 'react';
import {inject} from 'mobx-react';

import bevis from '@denstep-core/libs/bevis';
import {Text} from '@denstep-core/components/text';
import {ClientDataModel} from 'admin/models/client-data';
import {Bender} from 'admin/components/bender';

import './index.scss';

interface IProps {
    clientDataModel?: ClientDataModel;
}

const b = bevis('forbidden');

@inject('clientDataModel')
export class ForbiddenPage extends React.Component<IProps> {
    private telegramAuthRef = React.createRef<HTMLDivElement>();

    public componentDidMount(): void {
        const authScript = document.createElement('script');
        authScript.type = 'text/javascript';
        authScript.async = true;
        authScript.src = 'https://telegram.org/js/telegram-widget.js?7';
        authScript.setAttribute('data-telegram-login', this.props.clientDataModel!.telegramBotName);
        authScript.setAttribute('data-size', 'large');
        authScript.setAttribute('data-auth-url', '');
        authScript.setAttribute('data-request-access', 'write');

        this.telegramAuthRef.current!.appendChild(authScript);
    }

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <Bender/>
                <div className={b('auth-container')}>
                    <Text
                        text='Forbidden'
                        colorPreset='dark'
                        typePreset='header'
                    />
                    <div className={b('login-button')} ref={this.telegramAuthRef}/>
                </div>
            </div>
        );
    }
}
