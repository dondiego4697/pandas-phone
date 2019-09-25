import * as React from 'react';

import bevis from '@denstep-core/libs/bevis';
import {Social} from 'client/components/social';
import {IClientSocialLinks} from 'common/types';

import './index.scss';

const b = bevis('face-panel');

interface IProps {
    socialLinks: IClientSocialLinks;
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
                            <Social socialLinks={this.props.socialLinks}/>
                        </div>
                    </div>
                    <div className={b('another-container')}/>
                </div>
            </div>
        );
    }
}
