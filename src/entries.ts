import { useCallback, useMemo, useState } from "react";
import { throttle } from "./throttle";

export type Entry<T> = {
  ready: boolean;
  data: T;
};

export type EntryKey = string;

type EntryIndex<T> = Record<EntryKey, Entry<T>>;

const EMPTY = Object.create(null);

const FLUSH_THROTTLE = 150;

const PLACEHOLDER: Entry<null> = {
  ready: false,
  data: null,
};

export function useEntries<T>() {
  const [index, setIndex] = useState<EntryIndex<T>>(EMPTY);

  const set = useMemo(() => {
    let buffer: EntryIndex<T> = {};

    const flush = throttle(() => {
      setIndex((entries) => {
        return { ...entries, ...buffer };
      });

      buffer = {};
    }, FLUSH_THROTTLE);

    return function set(id: EntryKey, data: T) {
      buffer[id] = {
        ready: true,
        data,
      };

      flush();
    };
  }, []);

  const get = useCallback(
    (id: EntryKey): Entry<T | null> => {
      return index[id] || PLACEHOLDER;
    },
    [index],
  );

  return { get, set, index };
}
