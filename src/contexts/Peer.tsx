import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import Peer from 'peerjs';

import { ContextNotInProviderError } from './helpers';
import LocalStorage from 'services/LocalStorage';

type PeerType = Peer | null;
type SetPeerType = Dispatch<SetStateAction<PeerType>>;

const PeerContext = createContext<PeerType | undefined>(undefined);
const SetPeerContext = createContext<SetPeerType | undefined>(undefined);
const PEER_STORAGE_KEY = '_video-chat_peer';

let initialPeer: PeerType = null;

const peerUsername = LocalStorage.get(PEER_STORAGE_KEY) || null;

const peerOptions = {
  host: (process.env.REACT_APP_BACKEND_URL as string).replace(':3001', ''),
  port: 3001,
  path: '/peerjs',
};

if (peerUsername) {
  initialPeer = new Peer(peerUsername, peerOptions);
}

const PeerProvider: React.FC = ({ children }) => {
  const [peer, setPeer] = useState(initialPeer);
  return (
    <SetPeerContext.Provider value={setPeer}>
      <PeerContext.Provider value={peer}>{children}</PeerContext.Provider>
    </SetPeerContext.Provider>
  );
};

const useSetPeer = () => {
  const setPeer = useContext(SetPeerContext);

  if (setPeer === undefined) {
    throw new ContextNotInProviderError();
  }

  return (peerUsername: string) => {
    setPeer(new Peer(peerUsername, peerOptions));
    LocalStorage.set(PEER_STORAGE_KEY, peerUsername);
  };
};

const useCurrentPeer = (): PeerType => {
  const peer = useContext(PeerContext);

  if (peer === undefined) {
    throw new ContextNotInProviderError();
  }

  useEffect(() => {
    if (peer) {
      peer.on('open', id => {
        LocalStorage.set(PEER_STORAGE_KEY, id);
      });
      return () => peer.off('open', () => {});
    }
  }, [peer]);

  return peer;
};

export { PeerProvider, useCurrentPeer, useSetPeer };
