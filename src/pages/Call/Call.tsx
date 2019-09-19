import React, { useState } from 'react';
import { withRouter, RouteComponentProps, Redirect } from 'react-router';
import { useCall } from 'hooks/call';

import { VideoControls, Video, Chat } from './partials';

import './Call.scss';

type Props = RouteComponentProps<{ callId: string }>;

const Call: React.FC<Props> = ({
  match: {
    params: { callId },
  },
  location: { pathname },
}) => {
  const { myStream, peers, peer } = useCall(callId);

  const [activeStream, setActiveStream] = useState(myStream);

  if (!peer) {
    return <Redirect to={`${pathname}/register`} />;
  }

  return (
    <div className='Call'>
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
    </div>
  );
};

export default withRouter(Call);
