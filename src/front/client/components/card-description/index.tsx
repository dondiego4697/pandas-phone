import * as React from 'react';

import bevis from '@denstep/libs/bevis';

import './index.scss';

const b = bevis('card-description');

export interface ICardDescriptionField {
    icon: string;
    text: string;
    textClassName?: 'price' | 'old-price' | 'discount';
}

interface IProps {
    fields: ICardDescriptionField[];
}

export class CardDescription extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    {this.props.fields.map((field, i) => {
                        return <div className={b('line')} key={`key-${field.icon}-${i}`}>
                            <img className={b('icon')} src={`/public/imgs/card-description/${field.icon}.png`}/>
                            <div className={b('text')}><p className={field.textClassName}>{field.text}</p></div>
                        </div>;
                    })}
                </div>
            </div>
        );
    }
}
