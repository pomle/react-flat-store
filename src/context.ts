import { createContext, createElement, useContext } from "react";
import { FlatStore } from "./flat-store";

interface FlatStoreContextProps {
  children: React.ReactNode;
}

export function createStoreContext<T extends Record<string, FlatStore<any>>>(
  useState: () => T,
) {
  type StoreContextState = T;

  const Context = createContext<StoreContextState | null>(null);

  function FlatStoreContext({ children }: FlatStoreContextProps) {
    const value = useState();
    return createElement(Context.Provider, { value }, children);
  }

  function useFlatStore() {
    const context = useContext(Context);
    if (!context) {
      throw new Error("useStore without StoreContext");
    }
    return context;
  }
  return { useFlatStore, FlatStoreContext };
}
