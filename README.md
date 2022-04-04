# React Flat Store

Flat, typed store for normalised data. FlatStore builds on the premise that you want to store entities with the same id in only one place, and be able to point at them to maintain lists.

To accomplish this, flat store abstracts the following work loads.

- Setting up key/value stores.
- Reading and Writing from key/value stores.
- Maintaining collections of ids pointing to values in key/value stores.
- Providing arrays of objects based on collections and key/value stores.
- Providing updates to React.

## Usage

Flat Store comes with one core component, the `useEntity` hook. You are encourage to set up your solution by providing a hook that provides the entire state tree to the context creator, then call `useStore` hook provided by context creator to access the store.

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
      return <>Loading user id {userId} </>;
    }

    const user = userEntry.data;

    if (!user) {
      return <>User with id {userId} does not exist</>;
    }

    return <>User name: {user.username}</>;
  }
  ```

## Documentation

### `useEntity`

Hook containing entities and collections.
