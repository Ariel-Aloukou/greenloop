"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface ActivityEntry {
  label: string;
  zone: string;
  pts: string;
  time: string;
  iconName: string;
  color: string;
}

export interface UserData {
  name: string;
  email: string;
  phone?: string;
  joinDate: string;
  points: number;
  activityLog: ActivityEntry[];
}

interface AuthContextValue {
  user: UserData | null;
  isAuthenticated: boolean;
  register: (data: { name: string; email: string; phone?: string }) => void;
  addPoints: (amount: number) => void;
  logout: () => void;
}

const STORAGE_KEY = "greengas-user";

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  register: () => {},
  addPoints: () => {},
  logout: () => {},
});

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days}j`;
  return `Il y a ${Math.floor(days / 7)} sem`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        // Lecture unique de l'état persistant au montage. `localStorage`
        // n'existe pas au rendu serveur : lire ici évite un mismatch
        // d'hydratation. C'est une synchronisation ponctuelle avec un système
        // externe, pas une boucle de rendu.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const persist = useCallback((data: UserData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data);
  }, []);

  const register = useCallback(
    (data: { name: string; email: string; phone?: string }) => {
      const newUser: UserData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        joinDate: new Date().toISOString(),
        points: 25, // bonus de bienvenue
        activityLog: [
          {
            label: "Bienvenue",
            zone: "Compte créé",
            pts: "+25 pts",
            time: "À l'instant",
            iconName: "Gift",
            color: "#4ade80",
          },
        ],
      };
      persist(newUser);
    },
    [persist]
  );

  const addPoints = useCallback(
    (amount: number) => {
      if (!user) return;
      const entry: ActivityEntry = {
        label: "Dépôt scanné",
        zone: "BAC-014 · Résidence Atlantic",
        pts: `+${amount} pts`,
        time: formatRelativeTime(Date.now()),
        iconName: "QrCode",
        color: "#4ade80",
      };
      const updated: UserData = {
        ...user,
        points: user.points + amount,
        activityLog: [entry, ...user.activityLog].slice(0, 10),
      };
      persist(updated);
    },
    [user, persist]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        register,
        addPoints,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
