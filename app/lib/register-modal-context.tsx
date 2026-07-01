"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface RegisterModalContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RegisterModalContext = createContext<RegisterModalContextValue>({
  open: false,
  onOpenChange: () => {},
});

export function RegisterModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <RegisterModalContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </RegisterModalContext.Provider>
  );
}

export function useRegisterModal() {
  return useContext(RegisterModalContext);
}
