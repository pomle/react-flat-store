import { Entry, EntryKey, useEntries } from "./entries";
import { Collection, useCollection } from "./collection";

export type EntityStore<T> = {
  entries: {
    set: (id: EntryKey, data: T) => void;
    get: (id: EntryKey) => Entry<T | null>;
  };
  collection: Collection<T>;
};

export function useEntity<T>() {
  const entries = useEntries<T>();
  const collection = useCollection<T>(entries.get);

  return {
    entries,
    collection,
  };
}
