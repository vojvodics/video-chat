import React, { useEffect } from 'react';
import { Form, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps, withRouter } from 'react-router';
import Socket from 'services/Socket';
import { socketEvents } from 'constants/index';

import './CreateRoom.scss';

type Props = FormComponentProps & RouteComponentProps;

const CreateRoomForm: React.FC<Props> = ({ history }) => {
  useEffect(() => {
    Socket.on(socketEvents.ROOM_CREATED, (room: string) => {
      history.push(`call/${room}`);
    });

    return () => {
      Socket.off(socketEvents.ROOM_CREATED);
    };
  }, [history]);

  return (
    <Form
      className='CreateRoom'
      onSubmit={e => {
        e.preventDefault();
        Socket.emit(socketEvents.INIT_ROOM);
      }}>
      <h1>Welcome</h1>
      <p>What are you waiting for? Join</p>
      <Form.Item>
        <Button shape='round' type='primary' block htmlType='submit'>
          Create room
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedForm = Form.create<Props>({ name: 'create-room' })(CreateRoomForm);

export default withRouter(WrappedForm);
