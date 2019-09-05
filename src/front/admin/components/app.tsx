import * as React from 'react';
import {connect} from 'react-redux';

import {AppState} from 'admin/app-state';
import {setAdminAccess} from 'admin/actions';
import {Forbidden} from 'admin/components/forbidden';
import bevis from 'lib/bevis';

import './app.scss'

interface Props {
    adminForbidden: boolean;
}

type MergedProps = Props & typeof actionsToProps;

interface State {}

const actionsToProps = {
    setAdminAccess
};

declare global {
    interface Window {
        clientData: AppState;
    }
}

function stateToProps(state: AppState): Props {
    return {
        adminForbidden: state.adminForbidden
    };
}

const b = bevis('admin');

class App extends React.Component<MergedProps, State> {
    private telegramAuthRef = React.createRef<HTMLDivElement>()

    componentDidMount() {
        this.props.setAdminAccess(window.clientData.adminForbidden);
        const authScript = document.createElement('script');
        authScript.type = 'text/javascript';
        authScript.async = true;
        authScript.src = 'https://telegram.org/js/telegram-widget.js?7';
        authScript.setAttribute('data-telegram-login', 'PandaPhoneShopBot');
        authScript.setAttribute('data-size', 'large');
        authScript.setAttribute('data-auth-url', '');
        authScript.setAttribute('data-request-access', 'write');

        this.telegramAuthRef.current!.appendChild(authScript);
    }

    render() {
        let page;
        if (this.props.adminForbidden) {
            page = <div className={b('container')}>
                <Forbidden/>
                <div className={b('auth')} ref={this.telegramAuthRef}></div>
            </div>;
        } else {
            page = <div></div>;
        }

        return (
            <div className={b()}>
                {page}
            </div>
        );
    }
}

export default connect(stateToProps, actionsToProps)(App);
