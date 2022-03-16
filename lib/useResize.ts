import { useCallback, useEffect, useState } from 'react'

interface Props {
  minWidth: number;
}

interface ReturnProps {
  width: number;
  enableResize: () => void;
}

const useResize = ({
  minWidth,
}: Props): ReturnProps => {
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(minWidth);

  const enableResize = useCallback(() => {
    setIsResizing(true);
  }, [setIsResizing]);

  const disableResize = useCallback(() => {
    setIsResizing(false);
  }, [setIsResizing]);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = window.innerWidth - e.clientX + 10;
        if (newWidth >= minWidth) {
          setWidth(newWidth);
        }
      }
    },
    [minWidth, isResizing, setWidth],
  );

  useEffect(() => {
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', disableResize);

    return () => {
      document.removeEventListener('mousemove', resize)
      document.removeEventListener('mouseup', disableResize)
    }
  }, [disableResize, resize]);

  return { width, enableResize };
}

export default useResize;