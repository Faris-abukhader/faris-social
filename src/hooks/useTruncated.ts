import { useState, useLayoutEffect, type RefObject } from "react";

interface UseTruncatedElementProps {
  ref: RefObject<HTMLElement>;
}

export const useTruncatedElement = ({ ref }: UseTruncatedElementProps) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [isReadingMore, setIsReadingMore] = useState(false);

  useLayoutEffect(() => {
    const { offsetHeight, scrollHeight } = ref.current || {};

    if (offsetHeight && scrollHeight && offsetHeight < scrollHeight) {
      setIsTruncated(true);
    } else {
      setIsTruncated(false);
    }
  }, [ref]);

  return {
    isTruncated,
    isReadingMore,
    setIsReadingMore,
  };
};
