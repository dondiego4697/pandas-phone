import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import {TabPanel} from 'admin/components/tab-panel';

import bevis from 'lib/bevis';

import './index.scss';

const b = bevis('navigation');

interface Tab {
    label: string;
    children: React.ReactNode;
}

interface Props {
    tabItem: number;
    tabs: Tab[];
    handleTabChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

export default class Navigation extends React.Component<Props> {
    render(): React.ReactNode {
        const {tabItem, tabs, handleTabChange} = this.props;

        return (
            <div className={b('container')}>
                <AppBar position='static' color='default'>
                    <Tabs
                        value={this.props.tabItem}
                        onChange={handleTabChange}
                        indicatorColor='primary'
                        textColor='primary'
                        variant='scrollable'
                        scrollButtons='auto'
                    >
                        {tabs.map((tab, i) => (
                            <Tab
                                label={tab.label}
                                key={`tab_item_${i}`}
                            />
                        ))}
                    </Tabs>
                </AppBar>
                {tabs.map((tab, i) => (
                    <TabPanel
                        value={this.props.tabItem}
                        index={i}
                        key={`tab_panel_item_${i}`}
                    >
                        {tab.children}
                    </TabPanel>
                ))}
            </div>
        );
    }
}
