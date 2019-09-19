import * as React from 'react';

import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('edit-text');

interface IProps {
    id: string;
    label: string;
    placeholder: string;
}

function makeId(id: string): string {
    return `${id}_${Math.random()}`;
}

export class EditText extends React.Component<IProps> {
    public render(): React.ReactNode {
        const id = makeId(this.props.id);
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <div className={b('wrapper')}>
                        <div className={b('input')}>
                            <input
                                type='text'
                                id={id}
                                className={b('input-text')}
                                placeholder={this.props.placeholder}
                            />
                            <label
                                htmlFor={id}
                                className={b('input-label')}
                            >
                                {this.props.label}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
