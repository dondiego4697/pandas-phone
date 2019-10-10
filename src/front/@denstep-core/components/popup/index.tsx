import * as React from 'react';
import * as classnames from 'classnames';

import bevis from '@denstep-core/libs/bevis';
import {Text} from '@denstep-core/components/text';
import {crossPopupSvg} from '@denstep-core/components/svg';

import './index.scss';

const b = bevis('popup');

interface IProps {
    onClose: () => void;
    show: boolean;
}

export class Popup extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div
                className={classnames(b(), {
                    [b('hidden')]: !this.props.show
                })}
            >
                <div className={b('container')}>
                    <div className={b('wrapper')}>
                        <div
                            className={b('cross-container')}
                            onClick={this.props.onClose}
                        >
                            <div className={b('cross')}>
                                {crossPopupSvg}
                            </div>
                        </div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export function getAdminSimpleError(message: string): React.ReactNode {
    return (
        <div className={b('admin-simple-error')}>
            <img src='/public/imgs/bender-root/ops.png'/>
            <Text
                text={'OPS...'}
                typePreset='header'
                colorPreset='dark'
                textAlign='center'
            />
            <Text
                text={message}
                typePreset='text'
                colorPreset='dark'
                textAlign='center'
            />
        </div>
    );
}
