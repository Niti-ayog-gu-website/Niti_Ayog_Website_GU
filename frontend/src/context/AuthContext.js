import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// const BASE_URL = "http://localhost:5000/api";
const BASE_URL = process.env.REACT_APP_API_URL + "/api";
export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin]   = useState(false);
  const [admin, setAdmin]       = useState(null);
  const [loading, setLoading]   = useState(true); // checking stored token on mount

  // On mount — check if a token is already stored
  useEffect(() => {
    const token = localStorage.getItem("skillmap_token");
    const saved = localStorage.getItem("skillmap_admin");
    if (token && saved) {
      setIsAdmin(true);
      setAdmin(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  // ── Login ─────────────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Login failed");
    }

    // Store token and admin info in localStorage
    localStorage.setItem("skillmap_token", data.token);
    localStorage.setItem("skillmap_admin", JSON.stringify(data.admin));

    setIsAdmin(true);
    setAdmin(data.admin);

    return data;
  };

  // ── Logout ────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("skillmap_token");
    localStorage.removeItem("skillmap_admin");
    setIsAdmin(false);
    setAdmin(null);
  };

  // ── Authenticated fetch helper ────────────────────────────────
  // Use this anywhere you need to call a protected API route
  const authFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("skillmap_token");
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    // If 401 — token expired, auto logout
    if (res.status === 401) {
      logout();
      throw new Error("Session expired. Please log in again.");
    }

    return res.json();
  };

  return (
    <AuthContext.Provider value={{ isAdmin, admin, loading, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}