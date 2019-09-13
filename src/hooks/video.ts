import { useRef, useEffect } from 'react';

export const useVideo = (stream: MediaStream | null) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return videoRef;
};
