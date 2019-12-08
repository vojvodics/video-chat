import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { PeerProvider } from 'contexts/Peer';
import { SettingsProvider } from 'contexts/Settings';
import { ConnectionsProvider } from 'contexts/Connections';

ReactDOM.render(
  <BrowserRouter>
    <PeerProvider>
      <SettingsProvider>
        <ConnectionsProvider>
          <App />
        </ConnectionsProvider>
      </SettingsProvider>
    </PeerProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
