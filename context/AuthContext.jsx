"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { getData } from "@/actions/get";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuthState] = useState(null);
  const [showPrice, setShowPrice] = useState(false);
  const router = useRouter();

  // Custom setAuth function that updates both state and cookies
  const setAuth = (newAuthData) => {
    if (newAuthData) {
      // If there's auth data, set both state and cookies
      Cookies.set("auth", JSON.stringify(newAuthData), { expires: 7 });
      setAuthState(newAuthData);
    } else {
      // If null/undefined, clear both state and cookies
      Cookies.remove("auth");
      setAuthState(null);
    }
  };

  // Load initial auth state from cookies
  useEffect(() => {
    const storedAuth = Cookies.get("auth");
    const fetchData = async (data) => {
      try {
        const [userData] = await Promise.all([
          getData(`/api/users/${data?.id}`, "user"),
        ]);
        console.log(userData, "headeer user");
        setAuth(userData);
      } catch (error) {
        console.log(error);
      }
    };
    if (storedAuth) {
      fetchData(JSON.parse(storedAuth));
    }
    const fetchPriceShow = async () => {
      try {
        const show = await getData("/api/price-switch", "price-switch");
        setShowPrice(Boolean(show?.show));
      } catch (error) {}
    };
    fetchPriceShow();
  }, []);

  // Login function
  const login = (userData) => {
    setAuth(userData); // Use the custom setAuth
    router.push("/"); // Redirect to home page
  };

  // Logout function
  const logout = () => {
    setAuth(null); // Use the custom setAuth
    router.push("/"); // Redirect to home page
  };

  return (
    <AuthContext.Provider value={{ showPrice, auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
