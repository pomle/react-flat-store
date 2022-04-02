import { Entry } from "./entries";

export function withData<T>(entry: Entry<T | null>): entry is Entry<T> {
  return !!entry.data;
}

export function toList<T>(entries: Entry<T | null>[] | null) {
  if (!entries) {
    return [];
  }
  return entries.filter(withData).map((entry) => entry.data);
}
