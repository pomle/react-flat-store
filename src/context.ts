import { createContext, createElement, useContext } from "react";
import { EntityStore } from "./entity";

interface FlatStoreContextProps {
  children: React.ReactNode;
}

export function createStoreContext<
  StoreContextState extends Record<string, EntityStore<any>>
>(useState: () => StoreContextState) {
  const Context = createContext<StoreContextState | null>(null);

  function StoreContext({ children }: FlatStoreContextProps) {
    const value = useState();
    return createElement(Context.Provider, { value }, children);
  }

  function useStore() {
    const context = useContext(Context);
    if (!context) {
      throw new Error("useStore without StoreContext");
    }
    return context;
  }

  return { useStore, StoreContext };
}
