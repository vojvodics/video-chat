import React, { useEffect } from 'react';
import { Form, Button, Skeleton } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps, withRouter } from 'react-router';
import Socket from 'services/Socket';
import { socketEvents } from 'constants/index';
import { useCurrentPeer } from 'contexts/Peer';

type Props = FormComponentProps & RouteComponentProps;

const CreateRoomForm: React.FC<Props> = ({ history }) => {
  const peer = useCurrentPeer();

  useEffect(() => {
    Socket.on(socketEvents.ROOM_CREATED, (room: string) => {
      history.push(`call/${room}`);
    });

    return () => {
      Socket.off(socketEvents.ROOM_CREATED);
    };
  }, [history]);

  return (
    <Skeleton active loading={!peer}>
      {peer && (
        <Form
          onSubmit={e => {
            e.preventDefault();
            Socket.emit(socketEvents.INIT_ROOM);
          }}>
          {/* <Form.Item>
        {getFieldDecorator('room name', {
          rules: [
            {
              validator: (rule, value, cb) => {
                console.log(rule, value);
              },
            },
          ],
        })(
          <Input
            prefix={<Icon type='lock' />}
            placeholder='Room name (optional)'
          />,
        )}
      </Form.Item> */}
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Create room
            </Button>
          </Form.Item>
        </Form>
      )}
    </Skeleton>
  );
};

const WrappedForm = Form.create<Props>({ name: 'creat-room' })(CreateRoomForm);

export default withRouter(WrappedForm);
