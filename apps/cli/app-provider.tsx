import React, { useEffect } from "react";

import { DomainIocModule } from "@myty/rume-chat-domain";
import { GithubIocModule } from "@myty/rume-chat-github";
import { IoCContainer } from "@myty/rume-chat-ioc";
import { PersistenceIocModule } from "@myty/rume-chat-persistence";

const container = IoCContainer
  .create()
  .addModule(DomainIocModule)
  .addModule(PersistenceIocModule)
  .addModule(GithubIocModule)
  .build();

type Container = ReturnType<typeof container["beginScope"]>;

interface AppContext {
  container: Container;
}

const AppProviderContext = React.createContext<AppContext | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = (
  { children },
) => {
  const scopedContainer = container.beginScope();

  useEffect(() => {
    return () => {
      scopedContainer.dispose();
    };
  }, [scopedContainer]);

  return (
    <AppProviderContext.Provider value={{ container: scopedContainer }}>
      {children}
    </AppProviderContext.Provider>
  );
};

export const useAppContext = (): AppContext => {
  const context = React.useContext(AppProviderContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const useContainer = (): Container => {
  const { container } = useAppContext();
  return container;
};
