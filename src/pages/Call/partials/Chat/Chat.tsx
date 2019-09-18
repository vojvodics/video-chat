import React, { useState } from 'react';
import { Icon, Drawer, Input, Avatar, Badge, Button } from 'antd';

import './Chat.scss';
import { useChat } from 'hooks/chat';
import { withRouter, RouteComponentProps } from 'react-router';
import { useAutoScroll } from 'hooks/autoScroll';

const SendIcon = () => (
  <svg version='1.1' id='Capa_1' viewBox='0 0 448.011 448.011'>
    <g>
      <g>
        <path d='M438.731,209.463l-416-192c-6.624-3.008-14.528-1.216-19.136,4.48c-4.64,5.696-4.8,13.792-0.384,19.648l136.8,182.4    l-136.8,182.4c-4.416,5.856-4.256,13.984,0.352,19.648c3.104,3.872,7.744,5.952,12.448,5.952c2.272,0,4.544-0.48,6.688-1.472    l416-192c5.696-2.624,9.312-8.288,9.312-14.528S444.395,212.087,438.731,209.463z' />
      </g>
    </g>
  </svg>
);

const { TextArea } = Input;

const timeFormatter = new Intl.DateTimeFormat(window.navigator.language, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

type Props = RouteComponentProps<{ callId: string }>;

const Chat: React.FC<Props> = ({
  match: {
    params: { callId },
  },
}) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [value, setValue] = useState('');
  const {
    sortedMessages,
    sendMessage,
    peer,
    markAllAsRead,
    unreadMessagesCount,
  } = useChat(callId);

  const { ref, doScroll, canScroll } = useAutoScroll();

  const handleSendMessage = () => {
    if (value) {
      sendMessage(value);
      setValue('');
      // wait for message to be added to dom
      // hack but works
      setTimeout(() => {
        doScroll();
      });
    }
  };

  return (
    <>
      <div
        className='Chat-icon'
        onClick={() => {
          setChatOpen(true);
          markAllAsRead();
        }}>
        <Badge count={unreadMessagesCount} overflowCount={9}>
          <Button
            type='link'
            href='#'
            shape='circle'
            icon='message'
            size='large'
          />
        </Badge>
      </div>
      <Drawer
        className='Chat'
        visible={chatOpen}
        width='300px'
        onClose={() => setChatOpen(false)}>
        <div className='Chat-messages' ref={ref}>
          {sortedMessages.map(({ timestamp, text, from, id }) => (
            <div
              key={id}
              className={`Chat-message ${peer && peer.id === from && 'mine'}`}>
              <Avatar size={40} className='Chat-message-avatar'>
                {from && from.slice(0, 1)}
              </Avatar>
              <div className='Chat-message-container'>
                <div className='Chat-message-meta'>
                  {/* <div className='Chat-message-user'>{from}</div> */}
                  <div className='Chat-message-time'>
                    {timeFormatter.format(timestamp)}
                  </div>
                </div>
                <div className='Chat-message-text'>{text}</div>
              </div>
            </div>
          ))}
          {canScroll && (
            <>
              <Badge
                dot={unreadMessagesCount > 0}
                className='Chat-messages-down'
              />
              <Button
                href='#'
                type='link'
                shape='circle'
                icon='down-circle'
                size='large'
                className='Chat-messages-down'
                onClick={() => {
                  doScroll();
                  markAllAsRead();
                }}
              />
            </>
          )}
        </div>
        <div className='Chat-send'>
          <TextArea
            value={value}
            onChange={({ target: { value } }) => setValue(value)}
            placeholder='Write your message here'
            autosize={{ minRows: 1, maxRows: 5 }}
            className='Chat-send-input'
            onPressEnter={handleSendMessage}
          />
          <Icon
            className={`Chat-send-icon ${value.length === 0 ? 'disabled' : ''}`}
            component={SendIcon}
            onClick={handleSendMessage}
            style={{ fontSize: '20px' }}
          />
        </div>
      </Drawer>
    </>
  );
};

export default withRouter(Chat);
