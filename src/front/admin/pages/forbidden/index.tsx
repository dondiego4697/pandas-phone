import * as React from 'react';
import {inject} from 'mobx-react';

import bevis from 'lib/bevis';
import {ClientDataModel} from 'admin/models/client-data';

const b = bevis('forbidden');

interface Props {
    clientDataModel?: ClientDataModel;
}

import './index.scss';

@inject('clientDataModel')
export default class Forbidden extends React.Component<Props> {
    private telegramAuthRef = React.createRef<HTMLDivElement>();

    componentDidMount() {
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

    render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('auth-container')}>
                    <div className={b('text')}>
                        <h1>Forbidden</h1>
                    </div>
                    <div className={b('login-button')} ref={this.telegramAuthRef}></div>
                </div>
            </div>
        );
    }
}
