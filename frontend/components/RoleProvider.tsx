"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Role = "customer" | "employee";

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextValue>({
  role: "customer",
  setRole: () => {},
  toggleRole: () => {},
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("customer");
  const toggleRole = () => setRole((r) => (r === "customer" ? "employee" : "customer"));
  return (
    <RoleContext.Provider value={{ role, setRole, toggleRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
