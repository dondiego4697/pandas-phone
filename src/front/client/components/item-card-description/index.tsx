import * as React from 'react';

import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('item-card-description');

export interface IItemCardDescriptionField {
    icon: string;
    text: string;
    textClassName?: 'price' | 'old-price' | 'discount';
}

interface IProps {
    fields: IItemCardDescriptionField[];
}

export class ItemCardDescription extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    {this.props.fields.map((field, i) => {
                        return <div className={b('line')} key={`key-${field.icon}-${i}`}>
                            <img className={b('icon')} src={`/public/imgs/item-card-description/${field.icon}.png`}/>
                            <div className={b('text')}><p className={field.textClassName}>{field.text}</p></div>
                        </div>;
                    })}
                </div>
            </div>
        );
    }
}
