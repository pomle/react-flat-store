import { createContext, createElement, useContext } from "react";
import { FlatStore } from "./flat-store";

interface FlatStoreContextProps {
  children: React.ReactNode;
}

export function createStore(useState: () => Record<string, FlatStore<any>>) {
  type StoreContextState = ReturnType<typeof useState>;

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
