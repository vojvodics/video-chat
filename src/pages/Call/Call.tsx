import React, { useRef, memo, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useCall } from 'hooks/call';
import { Skeleton } from 'antd';

import { VideoControls } from './partials';

import './Call.scss';

type Props = RouteComponentProps<{ callId: string }>;

const useVideo = (stream: MediaStream | null) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return videoRef;
};

type VideoProps = { stream: MediaStream | null };
const Video: React.FC<VideoProps> = memo(({ stream }) => {
  const videoRef = useVideo(stream);

  return <video className='Video' autoPlay ref={videoRef} />;
});

const Call: React.FC<Props> = ({
  match: {
    params: { callId },
  },
}) => {
  const { myStream, peers, loading } = useCall(callId);

  const [activeStream, setActiveStream] = useState(myStream);

  console.log(activeStream, peers, myStream);

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
        </div>
      </div>
    </Skeleton>
  );
};

export default withRouter(Call);
