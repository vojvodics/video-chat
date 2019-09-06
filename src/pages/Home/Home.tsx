import React from 'react';

import PageLayout from 'components/PageLayout';
import { CreateRoom } from './partials';

const Home: React.FC = () => {
  return (
    <>
      <h2>Welcome</h2>
      <p>What are you waiting for? Join</p>
      <CreateRoom />
    </>
  );
};

export default Home;
