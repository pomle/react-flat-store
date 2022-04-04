import { useCallback, useState } from "react";
import { Entry, EntryKey } from "./entries";

type CollectionKey = string;

export type EntryCollection<T> = Entry<T | null>[];

export type Collection<T> = {
  get: (key: CollectionKey) => EntryCollection<T> | null;
  set: (key: CollectionKey, refs: EntryKey[]) => void;
};

type CollectionIndex = Record<CollectionKey, EntryKey[]>;

const EMPTY = Object.create(null);

export function useCollection<T>(getEntry: (id: EntryKey) => Entry<T | null>) {
  const [collections, setCollections] = useState<CollectionIndex>(EMPTY);

  const get = useCallback(
    (key: CollectionKey) => {
      const refs = collections[key];
      if (refs) {
        return refs.map(getEntry);
      }
      return null;
    },
    [collections, getEntry],
  );

  const set = useCallback((key: CollectionKey, refs: EntryKey[]) => {
    setCollections((collections) => {
      return { ...collections, [key]: refs };
    });
  }, []);

  return { get, set };
}
