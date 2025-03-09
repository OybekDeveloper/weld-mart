"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedAuth = Cookies.get("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  // ✅ Login funksiyasi
  const login = (userData) => {
    Cookies.set("auth", JSON.stringify(userData), { expires: 7 }); // 7 kun saqlanadi
    setAuth(userData);
    router.push("/"); // Login bo‘lgandan keyin Profile sahifasiga o‘tadi
  };

  // ✅ Logout funksiyasi
  const logout = () => {
    Cookies.remove("auth"); // Cookie'ni o‘chirish
    setAuth(null); // Context`ni yangilash
    router.push("/"); // Bosh sahifaga yo‘naltirish
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
