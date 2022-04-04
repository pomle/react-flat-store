# React Flat Store

Flat, typed store for normalised data.

## Usage

Flat Store comes with one core component, the `useEntity` hook. You are encourage to set up your solution by providing a hook that provides the entire state tree to the context creator, and then use the `useStore` hook that the context creator provides to access the store.

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

- Mount `StoreContext` from `store.ts` above where it is needed. Usually somewhere in the init of your app; here `Boot.tsx`.

  ```tsx
  import { StoreContext } from "./store";
  import App from "./App";

  export default function Boot() {
    return (
      <StoreContext>
        <App />
      </StoreContext>
    );
  }
  ```

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
      return <div>Loading user id {userId} </div>;
    }

    const user = userEntry.data;

    if (!user) {
      return <div>User with id {userId} does not exist</div>;
    }

    return <div>User name: {user.username}</div>;
  }
  ```
