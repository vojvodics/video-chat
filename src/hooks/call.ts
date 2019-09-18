import { useEffect } from 'react';

import { useCurrentPeer } from 'contexts/Peer';

import { useUserMedia } from './userMedia';
import { useRoom } from './room';
import { useSettings } from 'contexts/Settings';
import { PeerObject } from 'contexts/Connections';

export function useCall(callId: string) {
  const settings = useSettings();
  const { stream } = useUserMedia();

  const peer = useCurrentPeer();
  const { peers, setPeers } = useRoom(callId);

  useEffect(() => {
    if (stream) {
      stream.getAudioTracks().map(t => (t.enabled = Boolean(settings.audio)));
      stream.getVideoTracks().map(t => (t.enabled = Boolean(settings.video)));
    }
  }, [stream, settings]);

  useEffect(() => {
    if (stream && peer) {
      const handleDisconnet = (p: string) => () => {
        setPeers(allPeers => ({
          ...allPeers,
          [p]: { ...allPeers[p], disconnected: true },
        }));
        console.log('CLOSING STREAM from ', p);
      };

      const handleError = (p: string) => (error: any) => {
        setPeers(allPeers => ({
          ...allPeers,
          [p]: { ...allPeers[p], error },
        }));
      };

      const handleStream = (p: string) => (stream: MediaStream) => {
        setPeers(allPeers => ({
          ...allPeers,
          [p]: {
            ...allPeers[p],
            calling: false,
            stream,
          },
        }));
      };

      peer.on('call', call => {
        call.answer(stream);
        call.on('stream', handleStream(call.peer));

        call.on('error', handleError(call.peer));

        call.on('close', handleDisconnet(call.peer));
      });

      Object.values(peers).forEach((p: PeerObject) => {
        if (
          !p.calling &&
          p.stream === null &&
          !p.disconnected &&
          p.peer !== peer.id
        ) {
          const mediaconn = peer.call(p.peer, stream);
          console.log('Attempting to call', p);
          mediaconn.on('stream', handleStream(p.peer));

          mediaconn.on('error', handleError(p.peer));

          mediaconn.on('close', handleDisconnet(p.peer));
        }
      });

      return () => {
        peer.off('call', () => {});
      };
    }
  }, [peers, setPeers, peer, stream]);

  return {
    myStream: stream,
    peers,
    loading: peer === null,
    peer,
  };
}
