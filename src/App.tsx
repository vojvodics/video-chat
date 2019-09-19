import React from 'react';
import { Switch, Route } from 'react-router';

import './App.scss';
import Home from './pages/Home';
import Call from 'pages/Call';
import RegisterCall from 'pages/RegisterCall';

const App: React.FC = () => {
  return (
    <Switch>
      <Route path='/' exact component={Home} />
      <Route path='/call/:callId/register' component={RegisterCall} />
      <Route path='/call/:callId' component={Call} />
    </Switch>
  );
};

export default App;
