import { useEffect, MutableRefObject } from "react";

/** Hook that alerts clicks outside of the passed ref */
export function useOnClickOutside(ref: MutableRefObject<any>, handler: Function) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
