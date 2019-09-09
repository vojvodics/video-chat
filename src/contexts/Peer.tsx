import React, { createContext, useContext, useState, useEffect } from 'react';
import Peer from 'peerjs';

import { ContextNotInProviderError } from './helpers';

const PeerContext = createContext<Peer | undefined>(undefined);

// TODO: add peer server on be
const peer = new Peer();

const PeerProvider: React.FC = ({ children }) => {
  return <PeerContext.Provider value={peer}>{children}</PeerContext.Provider>;
};

const useCurrentPeer = (): Peer | null => {
  const peer = useContext(PeerContext);

  if (peer === undefined) {
    throw new ContextNotInProviderError();
  }

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    peer.on('open', () => setInitialized(true));
    return () => peer.off('open', () => {});
  }, [setInitialized, peer]);

  if (!initialized) return null;

  return peer;
};

export { PeerProvider, useCurrentPeer };
