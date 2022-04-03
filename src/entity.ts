import { Entries, Entry, useEntries } from "./entries";
import { Collection, useCollection } from "./collection";

export type EntityStore<T> = {
  entries: {
    entries: Entries<T>;
    set: (id: string, data: T) => void;
    get: (id: string) => Entry<T | null>;
  };
  collection: Collection<T>;
};

export function useEntity<T>() {
  const entries = useEntries<T>();
  const collection = useCollection(entries.get);

  return {
    entries,
    collection,
  };
}
