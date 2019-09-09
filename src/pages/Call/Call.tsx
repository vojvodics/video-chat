import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useCall } from 'hooks/call';
import { Skeleton } from 'antd';

import { VideoControls, Video, Chat } from './partials';

import './Call.scss';

type Props = RouteComponentProps<{ callId: string }>;

const Call: React.FC<Props> = ({
  match: {
    params: { callId },
  },
}) => {
  const { myStream, peers, loading } = useCall(callId);

  const [activeStream, setActiveStream] = useState(myStream);

  return (
    <Skeleton active loading={loading} className='Call'>
      <div className='Call'>
        <div className='Video-previews'>
          <div
            className={`Video-wrapper ${
              activeStream === myStream ? 'active' : ''
            }`}
            onClick={() => setActiveStream(myStream)}>
            <Video stream={myStream} />
          </div>
          {Object.entries(peers).map(([peerId, { stream }]) => (
            <div
              className={`Video-wrapper ${
                activeStream === stream ? 'active' : ''
              }`}
              key={peerId}
              onClick={() =>
                stream !== activeStream && setActiveStream(stream)
              }>
              <Video stream={stream} />
            </div>
          ))}
        </div>
        <div className='Video-active'>
          <Video stream={activeStream} />
          <VideoControls />
          <Chat />
        </div>
      </div>
    </Skeleton>
  );
};

export default withRouter(Call);
