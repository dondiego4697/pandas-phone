import * as React from 'react';
import {Link} from 'react-router-dom';

import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('header');

interface IProps {
    budgeCount: number;
}

export class Header extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <Link className={b('logo-link')} to='/'>
                        <div className={b('logo')}/>
                    </Link>
                    <div className={b('logo-text')}>
                        <h1>Panda Phone.</h1>
                    </div>
                    <div className={b('cart-button')}>
                        <Link
                            className={b('cart-button-link')}
                            to='/cart'
                        >
                            <div className={b('cart-button-icon')}/>
                        </Link>
                        <div className={b('cart-budge')}>{this.props.budgeCount}</div>
                    </div>
                </div>
            </div>
        );
    }
}
