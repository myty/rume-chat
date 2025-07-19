"use client";

import { createContext, useContext, useState } from "react";

interface MobileAppSidebarContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const defaultContextValue: MobileAppSidebarContextValue = {
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
};

const MobileAppSidebarContext = createContext<
  MobileAppSidebarContextValue
>(defaultContextValue);

export const MobileAppSidebarProvider = (
  { children }: { children: React.ReactNode },
) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <MobileAppSidebarContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </MobileAppSidebarContext.Provider>
  );
};

export function useMobileAppSidebar() {
  const context = useContext(MobileAppSidebarContext);
  if (!context) {
    throw new Error(
      "useMobileAppSidebar must be used within a MobileAppSidebarProvider",
    );
  }
  return context;
}
