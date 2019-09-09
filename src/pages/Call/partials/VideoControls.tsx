import React from 'react';
import { Icon } from 'antd';

import { useSettings, useToggleAudio, useToggleVideo } from 'contexts/Settings';

import './VideoControls.scss';

const VideoControls = () => {
  const { audio, video } = useSettings();
  const toggleAudio = useToggleAudio();
  const toggleVideo = useToggleVideo();

  return (
    <div className='VideoControls'>
      <Icon
        onClick={toggleAudio}
        className={`VideoControls-button ${audio ? '' : 'inactive'}`}
        style={{ fontSize: '40px' }}
        type='audio'
      />
      <Icon
        onClick={toggleVideo}
        className={`VideoControls-button ${video ? '' : 'inactive'}`}
        style={{ fontSize: '40px' }}
        type='video-camera'
      />
    </div>
  );
};

export default VideoControls;
