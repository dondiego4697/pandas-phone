import * as React from 'react';
import {Link} from 'react-router-dom';
import * as classnames from 'classnames';

import bevis from '@denstep-core/libs/bevis';
import {Text} from '@denstep-core/components/text';
import {shoppingCartSvg} from '@denstep-core/components/svg';

import './index.scss';

const b = bevis('navbar');

interface IProps {
    cartItemsCount: number;
    onCartClick: () => void;
}

export class Navbar extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <nav className={b('navbar')}>
                        {this.renderLogo()}
                        <div/>
                        {this.renderButtons()}
                    </nav>
                </div>
            </div>
        );
    }

    private renderLogo(): React.ReactNode {
        return (
            <Link
                className={b('logo')}
                to='/'
            >
                <img src='/public/imgs/panda/black.svg'/>
                <Text
                    text='Panda Phone'
                    typePreset='header'
                    colorPreset='dark'
                    className={b('header-text')}
                />
            </Link>
        );
    }

    private renderButtons(): React.ReactNode {
        return (
            <div className={b('buttons-container')}>
                <div
                    className={b('cart-button')}
                    onClick={this.props.onCartClick}
                >
                    <span>{this.props.cartItemsCount}</span>
                    {shoppingCartSvg}
                    <p>Корзина</p>
                </div>
            </div>
        );
    }
}
