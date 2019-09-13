import { useEffect } from 'react';
import Socket from 'services/Socket';
import { socketEvents } from 'constants/index';
import { useCurrentPeer } from 'contexts/Peer';
import { useConnections, PeerObjectMap } from 'contexts/Connections';

export function useRoom(roomId: string) {
  const [peers, setPeers] = useConnections();

  const peer = useCurrentPeer();

  useEffect(() => {
    if (peer) {
      Socket.emit(socketEvents.JOIN_ROOM, roomId, peer.id);
      console.log('JOINING ROOM', roomId, peer.id);
      Socket.on(socketEvents.UPDATE_PEERS, (peerIds: string[]) => {
        const mappedPeers: PeerObjectMap = peerIds.reduce(
          (acc, curr) => ({
            ...acc,
            [curr]: {
              peer: curr,
              calling: false,
              stream: null,
              connecting: false,
            },
          }),
          {},
        );

        delete mappedPeers[peer.id];

        setPeers(mappedPeers);
      });

      return () => {
        Socket.emit(socketEvents.LEAVE_ROOM, roomId, peer.id);
        Socket.off(socketEvents.UPDATE_PEERS);
        setPeers({});
      };
    }
  }, [roomId, peer, setPeers]);

  console.log(peers);

  return {
    peers,
    setPeers,
  };
}
