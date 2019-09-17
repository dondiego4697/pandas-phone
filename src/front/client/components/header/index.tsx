import * as React from 'react';

import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('header');

export class Header extends React.Component<{}> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <div className={b('logo')}/>
                    <div className={b('logo-text')}>
                        <h1>Panda Phone.</h1>
                    </div>
                    <div className={b('cart-button')}>
                        <div className={b('cart-button-icon')}/>
                    </div>
                </div>
            </div>
        );
    }
}
