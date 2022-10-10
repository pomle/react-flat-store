import { useCallback, useState } from "react";

export type Entry<T> = {
  ready: boolean;
  data: T;
};

export type EntryKey = string;

type EntryIndex<T> = Record<EntryKey, Entry<T>>;

const EMPTY = Object.create(null);

const PLACEHOLDER: Entry<null> = {
  ready: false,
  data: null,
};

export function useEntries<T>() {
  const [index, setIndex] = useState<EntryIndex<T>>(EMPTY);

  const set = useCallback((id: EntryKey, data: T) => {
    const entry = {
      ready: true,
      data,
    };

    setIndex((entries) => {
      return { ...entries, [id]: entry };
    });
  }, []);

  const get = useCallback(
    (id: EntryKey): Entry<T | null> => {
      return index[id] || PLACEHOLDER;
    },
    [index],
  );

  return { get, set, index };
}
