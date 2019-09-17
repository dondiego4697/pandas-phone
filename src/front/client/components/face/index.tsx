import * as React from 'react';

import {ISocialLinks} from 'client/models/client-data';
import bevis from 'libs/bevis';

import './index.scss';

const b = bevis('face-panel');

interface IProps {
    socialLinks: ISocialLinks;
}

export class FacePanel extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('bg-container')}>
                    <div className={b('bg-blur')}/>
                </div>

                <div className={b('main-container')}>
                    <div className={b('text-container')}>
                        <div className={b('text-wrapper')}>
                            <h1>Modern</h1>
                            <h1 dangerouslySetInnerHTML={{__html: 'Apple&nbsp;Zone'}}/>
                            <div className={b('social-container')}>
                                <a className={b('social')} href={this.props.socialLinks.vk} target='_blank'>
                                    <img src='/public/imgs/vk-icon.svg'/>
                                </a>
                                <a className={b('social')} href={this.props.socialLinks.instagram} target='_blank'>
                                    <img src='/public/imgs/instagram-icon.svg'/>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className={b('another-container')}/>
                </div>
            </div>
        );
    }
}
