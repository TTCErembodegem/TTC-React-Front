import { useState, useEffect } from 'react';

export const useViewport = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const setSizes = () => {
      if (window.innerWidth !== width) {
        setWidth(window.innerWidth);
      }

      if (window.innerHeight !== height) {
        setHeight(window.innerHeight);
      }
    };

    setSizes();
    window.addEventListener('resize', setSizes);
    return () => window.removeEventListener('resize', setSizes);
  }, [width, height]);

  return { width, height };
};
