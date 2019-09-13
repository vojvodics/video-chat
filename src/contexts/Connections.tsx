import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';

import { ContextNotInProviderError } from './helpers';
import { MediaConnection, DataConnection } from 'peerjs';

export interface PeerObject {
  peer: string;
  calling: boolean;
  connecting: boolean;
  stream: MediaStream | null;
  disconnected?: boolean;
  error?: any;
  call?: MediaConnection;
  data?: DataConnection;
}

export interface PeerObjectMap {
  [peer: string]: PeerObject;
}

type SetConnectionsType = Dispatch<SetStateAction<PeerObjectMap>>;

const ConnectionsContext = createContext<PeerObjectMap | undefined>(undefined);
const SetConnectionsContext = createContext<SetConnectionsType | undefined>(
  undefined,
);

const ConnectionsProvider: React.FC = ({ children }) => {
  const [connections, setConnections] = useState({});
  return (
    <SetConnectionsContext.Provider value={setConnections}>
      <ConnectionsContext.Provider value={connections}>
        {children}
      </ConnectionsContext.Provider>
    </SetConnectionsContext.Provider>
  );
};

const useConnections = (): [PeerObjectMap, SetConnectionsType] => {
  const connections = useContext(ConnectionsContext);
  const setConnections = useContext(SetConnectionsContext);

  if (connections === undefined || setConnections === undefined) {
    throw new ContextNotInProviderError();
  }

  return [connections, setConnections];
};

export { ConnectionsProvider, useConnections };
