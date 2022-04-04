# React FlatStore

Flat, typed store for normalised data. FlatStore builds on the premise that you want to store entities with the same id in only one place, and be able to point at them to maintain lists.

To accomplish this, flat store abstracts the following work loads.

- Setting up key/value stores.
- Reading and Writing from key/value stores.
- Maintaining collections of ids pointing to values in key/value stores.
- Providing arrays of objects based on collections and key/value stores.
- Providing updates to React.

## Usage

FlatStore comes with one core component, the `useEntity` hook. You are encourage to set up your solution by providing a hook that provides the entire state tree to the context creator, then call `useStore` hook provided by context creator to access the store.

### Setup Store

In the example below we prepare our application for two entities; `User` and `Book`.

- Create a file containing the store setup; `store.ts`.

  ```ts
  import { useEntity, createStoreContext } from "@pomle/react-flat-store";

  type User = {
    id: string;
    username: string;
  };

  type Book = {
    id: string;
    title: string;
  };

  function useEntities() {
    return {
      users: useEntity<User>(),
      books: useEntity<Book>(),
    };
  }

  const { useStore, StoreContext } = createStoreContext(useEntities);

  export { useStore, StoreContext };
  ```

- Mount `StoreContext` from `store.ts` above where it is needed. Usually somewhere in the init of your app.

  ```tsx
  import { StoreContext } from "./store";
  import Main from "./Main";

  export default function App() {
    return (
      <StoreContext>
        <Main />
      </StoreContext>
    );
  }
  ```

### Interact with Store

- Call `useStore` in components to access your store for reading and writing. In the example below, an API that can fetch users from a backend is imagined.

  ```tsx
  import { useStore } from "./store";
  import { useAPI } from "./api";

  function useUser(userId: string) {
    const api = useAPI();
    const userStore = useStore().users;

    useEffect(() => {
      api.fetchUser(userId).then((user) => {
        userStore.entries.set(user.id, user);
      });
    }, [userId, userStore.entries.set]);

    const userEntry = userStore.entries.get(userId);

    return userEntry;
  }

  export default function UserInfo() {
    const userId = "3jk7f893j92385";

    const userEntry = useUser(userId);

    if (!userEntry.ready) {
      return <>Loading user id {userId}</>;
    }

    const user = userEntry.data;

    if (!user) {
      return <>User with id {userId} does not exist</>;
    }

    return <>User name: {user.username}</>;
  }
  ```

- Combine collection writes with entry writes to work with normalized data over multiple queries. Namespace can be used for isolating collections, as well as sharing collections.

  To share collections; use the same namespace.
  To isolate collections; use a secret namespace.

  ```tsx
  import { useStore } from "./store";
  import { useAPI } from "./api";

  const SEARCH_NAMESPACE = "user-search";

  function useUserQuery(searchQuery: string) {
    const userStore = useStore().users;

    useEffect(() => {
      api.queryUsers(searchQuery).then((users) => {
        const ids: string[] = [];
        users.forEach((user) => {
          ids.push(user.id);
          userStore.entries.set(user.id, user);
        });
        userStore.collection.set(SEARCH_NAMESPACE, ids);
      });
    }, [searchQuery, userStore.entries.set, userStore.collection.set]);

    const userEntries = userStore.collection.get(SEARCH_NAMESPACE);

    return userEntries;
  }

  export default function UserSearch() {
    const query = "john doe";

    const userEntries = useUserQuery(query);

    if (!userEntries) {
      return <>Loading result</>;
    }

    return userEntries.map((userEntry) => {
      if (!userEntry.data) {
        return <>No data</>;
      }

      const user = userEntry.data;

      return <>{user.username}</>;
    });
  }
  ```

## Documentation

- `Entry<T>`

  Represents a value in store.

  `ready` flag determines if this value has been set or is indetermined.
  `data` contains the value when set.

  ```ts
  type Entry<T> = {
    ready: boolean;
    data: T;
  };
  ```

- `EntryCollection<T>`

  Represents result from collection.

  ```ts
  type EntryCollection<T> = Entry<T | null>[];
  ```

- `Collection<T>`

  Stores collection pointers, and retrieves collection values.

  ```ts
  type Collection<T> = {
    get: (key: CollectionKey) => EntryCollection<T> | null;
    set: (key: CollectionKey, refs: EntryKey[]) => void;
  };
  ```

- `EntityStore<T>`

  Represents key/value store and collections pointing to values in store. Created by `useEntity`.

  ```ts
  type EntityStore<T> = {
    entries: {
      set: (id: EntryKey, data: T) => void;
      get: (id: EntryKey) => Entry<T | null>;
    };
    collection: Collection<T>;
  };
  ```

- `useEntity<T>(): EntityStore<T>`

  Sets up state for key/value store and a handle that allows reading and writing values, and create and retrieve lists of values.

- `withData<T>(entry: Entry<T | null>)`

  Type Guard ensuring that Entry contains data.

  In the following example we imagine a search API which only returns search match metadata, and not the full data. In this case, we may populate the collection pointers before we receive the data. That means some entries in the collection will come in asynchronously after we are aware of them.

  If we do not care about placeholder, and are happy with new data popping in as it arrives, we can use `Array.filter` and `withData` guard to get an array back with Entries guaranteed to be populated.

  ```ts
  import { useStore } from "./store";
  import { useAPI } from "./api";

  const SEARCH_NAMESPACE = "book-search";

  function useBookQuery(searchQuery: string) {
    const api = useAPI();

    const bookStore = useStore().books;

    const fetchBook = useCallback(
      (bookId: string) => {
        api.fetchBook(bookId).then((book) => {
          bookStore.entries.set(book.id, book);
        });
      },
      [api, bookStore.entries.set],
    );

    useEffect(() => {
      api.queryBooks(searchQuery).then((matches) => {
        const ids: string[] = [];
        matches.forEach((bookMatch) => {
          ids.push(bookMatch.bookId);
          loadBook(bookMatch.bookId);
        });
        bookStore.collection.set(SEARCH_NAMESPACE, ids);
      });
    }, [api, fetchBook, searchQuery, bookStore.collection.set]);

    const bookEntries = bookStore.collection.get(SEARCH_NAMESPACE);

    return bookEntries;
  }

  export default function BookSearch() {
    const query = "hemingway";

    const bookEntries = useBookQuery(query);

    if (!bookEntries) {
      return <>Loading result</>;
    }

    return bookEntries.filter(withData).map((userEntry) => {
      const user = userEntry.data;
      return <>{user.username}</>;
    });
  }
  ```

- `toList(entries: EntryCollection<T> | null)`

  Helper that returns an Array of `T` guarateed regardless of state of collection and store. Use to ignore handling of asynchronous results.

  ```ts
  import { useStore } from "./store";
  import { useAPI } from "./api";

  const SEARCH_NAMESPACE = "book-search";

  function useBookQuery(searchQuery: string) {
    const api = useAPI();

    const bookStore = useStore().books;

    useEffect(() => {
      api.queryBooks(searchQuery).then((books) => {
        const ids: string[] = [];
        books.forEach((book) => {
          ids.push(book.id);
          bookStore.entries.set(book.id, book);
        });
        bookStore.collection.set(SEARCH_NAMESPACE, ids);
      });
    }, [api, searchQuery, bookStore.entries.set, bookStore.collection.set]);

    const bookEntries = bookStore.collection.get(SEARCH_NAMESPACE);

    return bookEntries;
  }

  export default function BookSearch() {
    const query = "hemingway";

    const bookEntries = useBookQuery(query);

    const books = useMemo(() => {
      return toList(bookEntries);
    }, [bookEntries]);

    return books.map((book) => {
      return <>{book.title}</>;
    });
  }
  ```

### Storage Format

You will interact with the store using function calls, but it can be useful for understanding to visualize how it works. Internally FlatStore uses a structure like below for storing and pointing at entities.

```ts
{
  entries: {
    index: {
      "af4295ae78577": {
        ready: true,
        data: {
          id: "af4295ae78577",
          title: "Old man and the sea",
        },
      },
      "398289e16ba4e": {
        ready: true,
        data: {
          id: "398289e16ba4e",
          title: "Young man and the sun",
        },
      },
    },
  },
  collection: {
    index: {
      "user/4aa66bde-d11e-4791-8a09-4beabb83fe70/dashboard": [
        "af4295ae78577",
        "398289e16ba4e",
      ],
    },
  },
}
```

## Higher-Order hooks

FlatStore is a low-level lib and when working with FlatStore you may notice that some operations become repetitive. You are encouraged to write higher order hooks that removes repetitive, recurring workloads.

A common example of this is when an API provides a list of entities and you want to normalise the entities and create a collection for them at the once. If all entities from the API follow a similar pattern, where they all have a `id` member, a hook like below may then be useful.

```ts
import { useCallback } from "react";
import { EntityStore } from "@pomle/react-flat-store";

export function useEntries<T extends { id: string }>(
  store: EntityStore<T>,
  namespace: string,
) {
  const { get: getCollection, set: setCollection } = store.collection;
  const { set: setEntry } = store.entries;

  const getEntries = useCallback(() => {
    return getCollection(namespace);
  }, [namespace, getCollection]);

  const setEntries = useCallback(
    (entities: T[]) => {
      const ids = entities.map((entry) => {
        setEntry(entry.id, entry);
        return entry.id;
      });

      setCollection(namespace, ids);
    },
    [namespace, setEntry, setCollection],
  );

  return { getEntries, setEntries };
}
```

Avoid repetitive tasks by leveraging the hook like below.

```ts
import { useEntries } from "./useEntries";

export function useBookQuery(options: any, namespace: string) {
  const api = useAPI();

  const bookStore = useStore().books;

  const { getEntries, setEntries } = useEntries(bookStore, namespace);

  useEffect(() => {
    api.queryBooks(options).then((books) => {
      setEntries(books);
    });
  }, [setEntries]);

  return getEntries();
}
```
