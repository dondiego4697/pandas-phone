import * as React from 'react';
import {Link} from 'react-router-dom';

import bevis from 'libs/bevis';

import './index.scss';
import {Button} from 'client/components/button';

const b = bevis('added-to-cart-popup');

interface IProps {
    onClose: () => void;
    show: boolean;
}

export class AddedToCartPopup extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={`${b()} ${this.props.show ? '' : b('hidden')}`}>
                <div className={b('container')}>
                    <div className={b('wrapper')}>
                        <h1 className={b('title')}>Добавлено в корзину</h1>
                        <div className={b('cross-container')} onClick={this.props.onClose}>
                            <div className={b('cross')}/>
                        </div>

                        <div className={b('controls-container')}>
                            <div className={b('button-container')}>
                                <Button
                                    text='Продолжить покупки'
                                    onClick={this.props.onClose}
                                />
                            </div>
                            <div className={b('button-container')} onClick={this.props.onClose}>
                                <Link className={b('to-cart')} to={`/cart`}><p>{'Перейти в корзину'}</p></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
