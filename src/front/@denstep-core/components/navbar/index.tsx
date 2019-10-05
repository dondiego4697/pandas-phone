import * as React from 'react';
import * as classnames from 'classnames';
import {Link} from 'react-router-dom';

import bevis from '@denstep-core/libs/bevis';

import './index.scss';

const b = bevis('navbar');

interface IPage {
    path: string;
    title: string;
}

interface ILogo {
    path: string;
    src: string;
}

interface IProps {
    pages: IPage[];
    current?: string;
    logo?: ILogo;
}

export class Navbar extends React.Component<IProps> {
    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <div className={b('container')}>
                    <nav className={b('navbar')}>
                        {this.renderLogo()}
                        {this.renderMenu()}
                    </nav>
                </div>
            </div>
        );
    }

    private renderMenu(): React.ReactNode {
        const forcePath = !this.props.current ? this.props.pages[0].path : null;

        return (
            <div className={b('menu')}>
                {
                    this.props.pages.map((page, i) => (
                        <Link
                            key={`key-navbar-link-${i}`}
                            className={classnames(b('link'), {
                                'active': forcePath ?
                                    forcePath === page.path :
                                    this.props.current === page.path
                            })}
                            to={page.path}
                        >
                            {page.title}
                        </Link>
                    ))
                }
            </div>
        );
    }

    private renderLogo(): React.ReactNode {
        if (!this.props.logo) {
            return <div/>;
        }

        return (
            <a
                className={b('logo')}
                href={this.props.logo.path}
            >
                <img src={this.props.logo.src} />
            </a>
        );
    }
}
