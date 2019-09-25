import * as React from 'react';

import {IClientSocialLinks} from 'common/types';
import bevis from '@denstep-core/libs/bevis';

import './index.scss';

const b = bevis('social');

interface IProps {
    socialLinks: IClientSocialLinks;
    style?: Record<string, any>;
}

export class Social extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()} style={this.props.style}>
                <div className={b('social-container')}>
                    <a className={b('social-item')} href={this.props.socialLinks.vk} target='_blank'>
                        <img src='/public/imgs/vk-icon.svg'/>
                    </a>
                    <a className={b('social-item')} href={this.props.socialLinks.instagram} target='_blank'>
                        <img src='/public/imgs/instagram-icon.svg'/>
                    </a>
                </div>
            </div>
        );
    }
}
