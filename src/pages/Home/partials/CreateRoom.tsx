import React from 'react';
import { Form, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

const CreateRoomForm: React.FC<FormComponentProps> = ({}) => {
  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
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
  );
};

const WrappedForm = Form.create({ name: 'creat-room' })(CreateRoomForm);

export default WrappedForm;
