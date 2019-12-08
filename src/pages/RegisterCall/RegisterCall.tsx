import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Form, Button, Input, Icon } from 'antd';
import Socket from 'services/Socket';
import { socketEvents } from 'constants/index';
import { FormComponentProps } from 'antd/lib/form';
import { useSetPeer, useCurrentPeer } from 'contexts/Peer';

import './RegisterCall.scss';

type Props = RouteComponentProps<{ callId: string }> & FormComponentProps;

const RegisterCall: React.FC<Props> = ({
  location: { pathname },
  match: {
    params: { callId },
  },
  history,
  form: { getFieldDecorator, getFieldValue },
}) => {
  const [loading, setLoading] = useState(false);
  const setPeer = useSetPeer();
  const peer = useCurrentPeer();

  useEffect(() => {
    if (peer && peer.id) {
      history.replace(pathname.replace('/register', ''));
    }
  }, [peer]);

  return (
    <Form
      className='RegisterCall'
      onSubmit={e => {
        e.preventDefault();
        const username = getFieldValue('username');

        Socket.emit(socketEvents.JOIN_ROOM, callId, username);
        setPeer(username);
        setLoading(true);
      }}>
      <h1>Enter your username</h1>
      <Form.Item>
        {getFieldDecorator('username', {
          rules: [
            { required: true, message: 'Please input your username!' },
            {
              validator: (rule, value, cb) => {
                Socket.emit(socketEvents.CHECK_USERNAME, value, callId);
                Socket.on(socketEvents.USERNAME_VALID, (isValid: boolean) => {
                  if (isValid) {
                    cb();
                  } else {
                    cb('Username is already taken');
                  }
                });
              },
            },
          ],
        })(<Input prefix={<Icon type='user' />} placeholder='Username' />)}
      </Form.Item>
      <Form.Item>
        <Button
          shape='round'
          type='primary'
          block
          htmlType='submit'
          loading={loading}>
          Join
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedForm = Form.create<Props>({ name: 'creat-room' })(RegisterCall);

export default withRouter(WrappedForm);
