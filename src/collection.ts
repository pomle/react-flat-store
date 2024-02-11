import { useCallback, useState } from "react";
import { Entry, EntryKey } from "./entries";

type CollectionKey = string;

export type EntryCollection<T> = Entry<T | null>[];

export type Collection<T> = {
  get: (key: CollectionKey) => EntryCollection<T> | null;
  set: (key: CollectionKey, refs: EntryKey[]) => void;
  del: (key: CollectionKey) => void;
};

type CollectionIndex = Record<CollectionKey, EntryKey[]>;

const EMPTY = Object.create(null);

export function useCollection<T>(getEntry: (id: EntryKey) => Entry<T | null>) {
  const [index, setIndex] = useState<CollectionIndex>(EMPTY);

  const get = useCallback(
    (key: CollectionKey) => {
      const refs = index[key];
      if (refs) {
        return refs.map(getEntry);
      }
      return null;
    },
    [index, getEntry],
  );

  const set = useCallback((key: CollectionKey, refs: EntryKey[]) => {
    setIndex((index) => {
      return { ...index, [key]: refs };
    });
  }, []);

  const del = useCallback((id: EntryKey) => {
    setIndex((entries) => {
      const next = { ...entries };
      delete next[id];
      return next;
    });
  }, []);

  return { get, set, del, index };
}
