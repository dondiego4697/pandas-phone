import * as React from 'react';
import * as classnames from 'classnames';

import bevis from '@denstep-core/libs/bevis';

import './index.scss';

const b = bevis('switch');

interface IProps {
    initialValue: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
}

export class Switch extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                {this.props.label && <p>{this.props.label}</p>}
                <label className={b('container')}>
                    <input
                        type='checkbox'
                        checked={this.props.initialValue}
                        onChange={this.onChange}
                    />
                    <span className={b('slider')}/>
                </label>
            </div>
        );
    }

    private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChange(event.target.checked);
    }
}
