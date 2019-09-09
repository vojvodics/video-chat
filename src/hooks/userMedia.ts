import { useState, useEffect } from 'react';

// const navigator = window.navigator;

// const getUserMediaPromise =
//   (navigator &&
//     navigator.mediaDevices &&
//     navigator.mediaDevices.getUserMedia) ||
//   ((constraints: MediaStreamConstraints) =>
//     new Promise((resolve, reject) => {
//       const getUserMedia =
//         window.navigator.getUserMedia ||
//         window.navigator.webkitGetUserMedia ||
//         window.navigator.mozGetUserMedia ||
//         window.navigator.msGetUserMedia;

//       getUserMedia(constraints, resolve, reject);
//     }));

const defaultOptions = { audio: true, video: true };

export function useUserMedia(
  constraints: MediaStreamConstraints = defaultOptions,
) {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let canceled = false;

    window.navigator.mediaDevices
      .getUserMedia(constraints)
      .then(media => !canceled && setStream(media))
      // TODO: error handling
      .catch(console.log);

    return () => {
      canceled = true;
    };
  }, [constraints]);

  return { stream };
}
