import * as React from 'react';
import * as classnames from 'classnames';

import bevis from '@denstep-core/libs/bevis';

import './index.scss';

const b = bevis('pagination');

interface IProps {
    limit: number;
    offset: number;
    total: number;
    onChange: (offset: number) => void;
}

enum Direction {
    LEFT = 'left',
    RIGHT = 'right'
}

const DOTS = '...';

export class Pagination extends React.Component<IProps> {
    public render(): React.ReactNode {
        const pageNumber = this.getPage();
        const pageCount = Math.ceil(this.props.total / this.props.limit);

        const leftButtonDisabled = pageNumber === 1;
        const rightButtonDisabled = pageNumber === pageCount;

        return (
            <div className={b()}>
                <nav className={b('container')}>
                    {this.renderButton(Direction.LEFT, leftButtonDisabled)}
                    {this.renderPages(pageNumber, pageCount)}
                    {this.renderButton(Direction.RIGHT, rightButtonDisabled)}
                </nav>
            </div>
        );
    }

    private getPage(): number {
        return this.props.offset / this.props.limit + 1;
    }

    private renderButton(direction: Direction, disabled: boolean): React.ReactNode {
        return (
            <div
                className={classnames(b('button'), {
                    [b('button_left')]: direction === Direction.LEFT,
                    [b('button_right')]: direction === Direction.RIGHT,
                    [b('button_disabled')]: disabled
                })}
                onClick={() => {
                    if (direction === Direction.LEFT) {
                        this.props.onChange((this.getPage() - 2) * this.props.limit);
                    } else {
                        this.props.onChange(this.getPage() * this.props.limit)
                    }
                }}
            >
                <div/>
            </div>
        );
    }

    private renderPages(pageNumber: number, pageCount: number): React.ReactNode {
        const pages: string[] = [];
        for (let i = 1; i <= pageCount; i++) {
            if (
                pageCount < 5 ||
                i === 1 || i === pageCount ||
                i >= pageNumber - 2 && i <= pageNumber + 2
            ) {
                pages.push(String(i));
            } else {
                if (pages[pages.length - 1] !== DOTS) {
                    pages.push(DOTS);
                }
            }
        }

        return (
            <ul className={b('pages-container')}>
                {pages.map((page, i) => (
                    <li
                        key={`pagination-page-item-${i}`}
                        className={classnames(b('pages-container-item'), {
                            'current': String(pageNumber) === page
                        })}
                        onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
                            const {target} = event;
                            const newPageNumber = (target as HTMLElement).innerText;
                            if (newPageNumber === DOTS) {
                                return;
                            }

                            this.props.onChange((Number(newPageNumber) - 1) * this.props.limit);
                        }}
                    >
                        <span>{page}</span>
                        {String(pageNumber) === page && <div className={b('effect')}/>}
                    </li>
                ))}
            </ul>
        );
    }
}
