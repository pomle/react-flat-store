import { useCallback, useState } from "react";
import { Entry, EntryKey } from "./entries";

type CollectionKey = string;

export type Collection<T> = {
  get: (key: CollectionKey) => Entry<T>[] | null;
  set: (key: CollectionKey, refs: EntryKey[]) => void;
};

const EMPTY = Object.create(null);

export function useCollection<T>(
  getEntry: (id: EntryKey) => Entry<T>,
): Collection<T> {
  const [collections, setCollections] = useState<
    Record<CollectionKey, EntryKey[]>
  >(EMPTY);

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

export function useRefs<T>(
  { get, set }: Collection<T>,
  namespace: CollectionKey,
) {
  const getRefs = useCallback(() => {
    return get(namespace);
  }, [namespace, get]);

  const setRefs = useCallback(
    (refs: string[]) => {
      set(namespace, refs);
    },
    [namespace, set],
  );

  return { getRefs, setRefs };
}
