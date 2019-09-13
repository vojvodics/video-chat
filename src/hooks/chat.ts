import { useEffect, useState, useCallback, useMemo } from 'react';
import uuid from 'uuidv4';
import { useConnections } from 'contexts/Connections';
import { useCurrentPeer } from 'contexts/Peer';
import LocalStorage from 'services/LocalStorage';

const CHAT_STORAGE_KEY = '_video-chat_storage';

interface Message {
  from: string;
  timestamp: number;
  text: string;
  status: 'UNREAD' | 'READ';
  id: string;
}

interface MessageMap {
  [id: string]: Message;
}

// type Action = 'NEW_MESSAGE' | 'MARK_AS_READ' | ''

// const messageReducer = (state: MessageMap, action: Action) => {

// }

const initialMessages: MessageMap =
  LocalStorage.getJSON(CHAT_STORAGE_KEY) || {};

export const useChat = () => {
  const [peers, setPeers] = useConnections();
  const peer = useCurrentPeer();
  const [chatMessages, setChatMessages] = useState(initialMessages);

  useEffect(() => {
    LocalStorage.set(CHAT_STORAGE_KEY, chatMessages);
  }, [chatMessages]);

  const addNewMessage = useCallback(
    (message: Message) =>
      setChatMessages(m => ({ ...m, [message.id]: message })),
    [setChatMessages],
  );

  const sortedMessages = useMemo(
    () => Object.values(chatMessages).sort((a, b) => a.timestamp - b.timestamp),
    [chatMessages],
  );

  const unreadMessages = useMemo(
    () => sortedMessages.filter(m => m.status === 'UNREAD'),
    [sortedMessages],
  );

  const unreadMessagesCount = useMemo(() => unreadMessages.length, [
    unreadMessages,
  ]);

  const markAsRead = useCallback(() => {}, []);

  const sendMessage = useCallback(
    (message: string) => {
      if (peer) {
        const msg: Message = {
          from: peer.id,
          timestamp: new Date().getTime(),
          text: message,
          status: 'UNREAD',
          id: uuid(),
        };

        addNewMessage(msg);

        Object.values(peers).forEach(({ data }) => {
          if (data) {
            data.send(msg);
          }
        });
      }
    },
    [addNewMessage, peer, peers],
  );

  useEffect(() => {
    if (peer) {
      console.log('setting up');
      const handleOpen = (peer: string) => () => {
        console.log('connection open');
        setPeers(prs => ({
          ...prs,
          [peer]: { ...prs[peer], connecting: true },
        }));
      };

      const handleData = (data: Message) => {
        console.log(data);
        addNewMessage(data);
      };

      Object.values(peers).map(p => {
        if (!p.connecting && !p.data && p.peer !== peer.id && !p.disconnected) {
          const data = peer.connect(p.peer);
          data.on('open', handleOpen(p.peer));
          data.on('data', handleData);
          setPeers(prs => ({ ...prs, [p.peer]: { ...p, data } }));
        }
      });

      peer.on('connection', conn => {
        console.log('received conn');
        conn.on('open', handleOpen(conn.peer));
        conn.on('data', handleData);
        setPeers(prs => ({
          ...prs,
          [conn.peer]: { ...prs[conn.peer], data: conn },
        }));
      });
    }
  }, [peer, peers, setPeers, addNewMessage]);

  return {
    chatMessages,
    sendMessage,
    sortedMessages,
    unreadMessagesCount,
    peer,
  };
};
