import React from 'react';
import { Switch, Route } from 'react-router';

import './App.scss';
import Home from './pages/Home';

const App: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
    </Switch>
  );
};

export default App;
