# React Flat Store

Typed, flat store for normalised data.

## Usage

Flat Store comes with one core component, the `useEntity` hook. You are encourage to set up your solution by providing a hook that provides the entire state tree to the context creator, and then use the `useStore` hook that the context creator provides to access the store.

In the example below we prepare our application for two entities; `User` and `Book`.

- `StoreContext.tsx`

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
