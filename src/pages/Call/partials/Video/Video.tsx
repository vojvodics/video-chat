import React, { memo } from 'react';

import { useVideo } from 'hooks/video';

import './Video.scss';

type VideoProps = { stream: MediaStream | null };

const Video: React.FC<VideoProps> = memo(({ stream }) => {
  const videoRef = useVideo(stream);

  return <video className='Video' autoPlay ref={videoRef} />;
});

export default Video;
