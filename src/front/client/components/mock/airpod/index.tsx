import * as React from 'react';

import bevis from '@denstep-core/libs/bevis';

import './index.scss';

const b = bevis('mock-airpod');

interface IProps {
    model: string;
}

export class MockAirpod extends React.Component<IProps> {
    private wrapperRef = React.createRef<HTMLDivElement>();
    public componentDidMount(): void {
        const {height} = this.wrapperRef.current!.parentElement!.getBoundingClientRect();
        (this.wrapperRef.current!.parentElement!.firstChild! as any).style.height = `${height}px`;
    }

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('image-wrapper')} ref={this.wrapperRef}>
                    <img
                        className={b('frame')}
                        src={`/public/imgs/airpods-mock/${this.props.model}.png`}
                    />
                </div>
            </div>
        );
    }
}
