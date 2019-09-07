import React, { createContext, useContext } from 'react';
import Peer from 'peerjs';

import { ContextNotInProviderError } from './helpers';

const PeerContext = createContext<Peer | undefined>(undefined);

const peer = new Peer();

const PeerProvider: React.FC = ({ children }) => {
  return <PeerContext.Provider value={peer}>{children}</PeerContext.Provider>;
};

const useCurrentPeer = (): Peer => {
  const peer = useContext(PeerContext);

  if (peer === undefined) {
    throw new ContextNotInProviderError();
  }

  return peer;
};

export { PeerProvider, useCurrentPeer };
