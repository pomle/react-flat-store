import { useCallback, useState } from "react";

export type Entry<T> = {
  data: T;
};

export type EntryKey = string;

type EntryIndex<T> = Record<EntryKey, Entry<T>>;

const EMPTY = Object.create(null);

const PLACEHOLDER: Entry<null> = {
  data: null,
};

export function useEntries<T>() {
  const [index, setIndex] = useState<EntryIndex<T>>(EMPTY);

  const set = useCallback((id: EntryKey, data: T) => {
    const entry: Entry<T> = {
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

  const del = useCallback((id: EntryKey) => {
    setIndex((entries) => {
      const next = { ...entries };
      delete next[id];
      return next;
    });
  }, []);

  return { get, set, del, index };
}
