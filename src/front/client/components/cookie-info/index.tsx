import * as React from 'react';

import bevis from '@denstep-core/libs/bevis';

import {Button} from 'client/components/button';
import {ClientCookie} from 'client/libs/cookie';

import './index.scss';

const b = bevis('cookie-info');

interface IState {
    visible: boolean;
}

export class CookieInfo extends React.Component<{}, IState> {
    public state = {visible: true};

    public componentDidMount(): void {
        const isCookieAccept = ClientCookie.isCookieAccept();
        this.setState({visible: !isCookieAccept});
    }

    public render(): React.ReactNode {
        return (
            <div className={`${b()} ${this.state.visible ? '' : b('hidden')}`}>
                <div className={`${b('container')}`}>
                    <div className={b('text-container')}>
                        <h1>
                            Этот сайт использует куки-файлы и другие технологии, чтобы помочь вам в навигации,
                            а также предоставить лучший пользовательский опыт,
                            анализировать использование наших продуктов и услуг,
                            повысить качество рекламных и маркетинговых активностей.
                        </h1>
                    </div>
                    <div className={b('button-container')}>
                        <Button
                            text='Принять'
                            onClick={this.pnAcceptHandler}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private pnAcceptHandler = () => {
        ClientCookie.setCookieAccept();
        this.setState({visible: false});
    }
}
