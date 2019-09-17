import React, { createContext, useContext, useState, useEffect } from 'react';
import Peer from 'peerjs';

import { ContextNotInProviderError } from './helpers';
import LocalStorage from 'services/LocalStorage';

const PeerContext = createContext<Peer | undefined>(undefined);
const PEER_STORAGE_KEY = '_video-chat_peer';

const peer = new Peer(LocalStorage.get(PEER_STORAGE_KEY) || undefined, {
  host: (process.env.REACT_APP_BACKEND_URL as string).replace(':3001', ''),
  port: 3001,
  path: '/peerjs',
});

const PeerProvider: React.FC = ({ children }) => {
  return <PeerContext.Provider value={peer}>{children}</PeerContext.Provider>;
};

const useCurrentPeer = (): Peer | null => {
  const peer = useContext(PeerContext);

  if (peer === undefined) {
    throw new ContextNotInProviderError();
  }

  const [initialized, setInitialized] = useState(Boolean(peer.id));

  useEffect(() => {
    peer.on('open', id => {
      setInitialized(true);
      LocalStorage.set(PEER_STORAGE_KEY, id);
    });
    return () => peer.off('open', () => {});
  }, [setInitialized, peer]);

  if (!initialized) return null;

  return peer;
};

export { PeerProvider, useCurrentPeer };
