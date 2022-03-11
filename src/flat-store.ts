import { useCallback, useMemo, useState } from "react";
import { throttle } from "@pomle/throb";

export type Entries<T> = Record<string, Entry<T>>;

export type Entry<T> = {
  ready: boolean;
  data: T;
};

export function withData<T>(entry: Entry<T | null>): entry is Entry<T> {
  return !!entry.data;
}

export function toList<T>(entries: Entry<T | null>[] | null) {
  if (!entries) {
    return [];
  }
  return entries.filter(withData).map((entry) => entry.data);
}

const EMPTY = Object.create(null);

const FLUSH_THOTTLE = 150;

const PLACEHOLDER: Entry<null> = {
  ready: false,
  data: null,
};

function useEntries<T>() {
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

type CollectionKey = string;

type Collection<T> = {
  get: (key: CollectionKey) => Entry<T>[] | null;
  set: (key: CollectionKey, refs: string[]) => void;
};

function useCollection<T>(getEntry: (id: string) => Entry<T>): Collection<T> {
  const [collections, setCollections] = useState<
    Record<CollectionKey, string[]>
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

  const set = useCallback((key: CollectionKey, refs: string[]) => {
    setCollections((collections) => {
      return { ...collections, [key]: refs };
    });
  }, []);

  return { get, set };
}

export function useFlatStore<T>() {
  const entries = useEntries<T>();
  const collection = useCollection(entries.get);

  return {
    entries,
    collection,
  };
}

export function useFlatCollection<T>(
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
