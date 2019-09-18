import { useState, useRef, useCallback, useLayoutEffect } from 'react';

const getIsAtBottom = (element: React.RefObject<HTMLDivElement>) => {
  if (element.current === null) {
    return false;
  }

  const { scrollTop, clientHeight, scrollHeight } = element.current;
  return scrollHeight - clientHeight - scrollTop === 0;
};

export const useAutoScroll = () => {
  // TODO: respect initial value
  const [canScroll, setCanScroll] = useState(false);

  // TODO: fix this ts bug
  const elementRef = useRef<HTMLDivElement>(null);

  const doScroll = useCallback(() => {
    if (elementRef.current !== null) {
      const { clientHeight, scrollHeight } = elementRef.current;
      elementRef.current.scroll({
        behavior: 'smooth',
        top: scrollHeight - clientHeight,
      });
      setCanScroll(false);
    }
  }, [setCanScroll]);

  useLayoutEffect(() => {
    if (elementRef.current !== null) {
      const handleScroll = () => {
        if (elementRef.current === null) return;

        const isAtBottom = getIsAtBottom(elementRef);
        // console.log(scrollTop,s scrollHeight, clientHeight);

        if (isAtBottom) {
          doScroll();
        }

        setCanScroll(!isAtBottom);
      };

      const currentListener = elementRef.current;

      currentListener.addEventListener('scroll', handleScroll);
      currentListener.addEventListener('resize', console.log);

      return () => {
        currentListener.removeEventListener('scroll', handleScroll);
      };
    }
  });

  return { ref: elementRef, doScroll, canScroll };
};
