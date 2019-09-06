import React from 'react';
import { Switch, Route } from 'react-router';

import './App.scss';
import Home from './pages/Home';
import PageLayout from 'components/PageLayout';

const App: React.FC = () => {
  return (
    <PageLayout>
      <Switch>
        <Route path='/' exact component={Home} />
      </Switch>
    </PageLayout>
  );
};

export default App;
