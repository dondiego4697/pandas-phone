import * as React from 'react';

import bevis from '@denstep/libs/bevis';

import './index.scss';

const b = bevis('cart-item');

interface IProps {
    onDelete: () => void;
}

export class CartItem extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    {this.props.children}
                    <div
                        className={b('cross-container')}
                        onClick={() => {
                            this.props.onDelete();
                        }}
                    >
                        <div className={b('cross')}/>
                    </div>
                </div>
            </div>
        );
    }
}
