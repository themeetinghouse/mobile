import { useRef } from 'react';

type Callback = () => unknown | Promise<unknown>;
export default function useDebounce() {
  const busy = useRef(false);
  const debounce = async (callback: Callback, delay = 1000) => {
    setTimeout(() => {
      busy.current = false;
    }, delay);

    if (!busy.current) {
      busy.current = true;
      if (callback) callback();
    }
  };

  return { debounce };
}
