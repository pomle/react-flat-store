import { useCallback, useMemo, useState } from "react";
import { throttle } from "./throttle";

export type Entries<T> = Record<string, Entry<T>>;

export type Entry<T> = {
  ready: boolean;
  data: T;
};

const EMPTY = Object.create(null);

const FLUSH_THOTTLE = 150;

const PLACEHOLDER: Entry<null> = {
  ready: false,
  data: null,
};

export function useEntries<T>() {
  const [entries, setEntries] = useState<Entries<T>>(EMPTY);

  const set = useMemo(() => {
    let buffer: Entries<T> = {};

    const flush = throttle(() => {
      setEntries((entries) => {
        return { ...entries, ...buffer };
      });

      buffer = {};
    }, FLUSH_THOTTLE);

    return function set(id: string, data: T) {
      buffer[id] = {
        ready: true,
        data,
      };

      flush();
    };
  }, []);

  const get = useCallback(
    (id: string): Entry<T | null> => {
      return entries[id] || PLACEHOLDER;
    },
    [entries],
  );

  return useMemo(() => {
    return { entries, set, get };
  }, [entries, set, get]);
}
