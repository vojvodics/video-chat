import { useRef, useLayoutEffect } from 'react';

export const useVideo = (stream: MediaStream | null) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useLayoutEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return videoRef;
};
