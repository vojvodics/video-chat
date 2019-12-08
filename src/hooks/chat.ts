import { useEffect, useState, useCallback, useMemo } from 'react';
import uuid from 'uuidv4';
import { useConnections } from 'contexts/Connections';
import { useCurrentPeer } from 'contexts/Peer';
import LocalStorage from 'services/LocalStorage';
import { notification } from 'antd';

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

const initialMessages: { [id: string]: MessageMap } =
  LocalStorage.getJSON(CHAT_STORAGE_KEY) || {};

export const useChat = (callId: string) => {
  const [peers, setPeers] = useConnections();
  const peer = useCurrentPeer();
  const [chatMessages, setChatMessages] = useState(
    initialMessages[callId] || ({} as MessageMap),
  );

  useEffect(() => {
    const allMessages: { [id: string]: MessageMap } =
      LocalStorage.getJSON(CHAT_STORAGE_KEY) || {};
    allMessages[callId] = chatMessages;
    // race condition?
    LocalStorage.set(CHAT_STORAGE_KEY, allMessages);
  }, [chatMessages, callId]);

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

  const markAsRead = useCallback(
    (mId: string) => {
      setChatMessages(m => ({ ...m, [mId]: { ...m[mId], status: 'READ' } }));
    },
    [setChatMessages],
  );

  const markAllAsRead = useCallback(() => {
    const nowReadMsgs = unreadMessages.reduce(
      (acc, curr) => ({ ...acc, [curr.id]: { ...curr, status: 'READ' } }),
      {},
    );
    setChatMessages(m => ({ ...m, ...nowReadMsgs }));
  }, [setChatMessages, unreadMessages]);

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
        markAsRead(msg.id);

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
      console.log('setting up', peer.id);
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
        notification.open({
          message: `New message from ${data.from}`,
          description: data.text,
          onClick: () => {
            markAsRead(data.id);
          },
        });
      };

      Object.values(peers).map(p => {
        if (
          !p.connecting &&
          peer.id !== null &&
          !p.data &&
          p.peer !== peer.id &&
          !p.disconnected
        ) {
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

      return () => {
        peer.off('connection', () => {
          console.log('removing connection listener');
        });
      };
    }
  }, [peer, peers, setPeers, addNewMessage, markAsRead]);

  return {
    chatMessages,
    sendMessage,
    sortedMessages,
    unreadMessagesCount,
    peer,
    markAllAsRead,
  };
};
