import * as React from 'react';
import * as classnames from 'classnames';

import bevis from '@denstep-core/libs/bevis';

import './index.scss';

const b = bevis('edit-text');

interface IProps {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    errorMessage?: string;
    inputType?: string;
}

export class EditText extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <div className={b('wrapper')}>
                        <div className={classnames(b('input'), {
                            [b('input-error')]: this.props.errorMessage
                        })}>
                            <input
                                type={this.props.inputType || 'text'}
                                value={this.props.value}
                                id={this.props.id}
                                onChange={this.props.onChange}
                                className={b('input-text')}
                                placeholder={this.props.placeholder}
                            />
                            <label
                                htmlFor={this.props.id}
                                className={b('input-label')}
                            >
                                {this.props.label}
                            </label>
                            <label
                                htmlFor={this.props.id}
                                className={classnames(b('input-label'), b('input-label-error'))}
                            >
                                {this.props.errorMessage}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
