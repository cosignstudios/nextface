/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";

interface AuthContextType {
  token: string | null;
  username: string | null;
  logout: () => void;
  deleteAccount: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setToken(session?.access_token || null);
      setUsername(session?.user?.user_metadata?.full_name || session?.user?.email || null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setToken(session?.access_token || null);
      setUsername(session?.user?.user_metadata?.full_name || session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setToken(null);
    setUsername(null);
  };

  const deleteAccount = async () => {
    // Note: Deleting a user via Supabase JS client from the browser is usually restricted
    // for security reasons. For a fully Serverless app without edge functions,
    // we would either need an edge function or the user must delete from dashboard.
    // For now, we will simply log them out and inform them.
    alert("Account deletion requires admin action in Supabase for security.");
    await logout();
  };

  if (loading) {
    return <div className="min-h-screen bg-brutal-bg flex items-center justify-center font-black uppercase text-2xl tracking-widest text-white">Initializing Protocol...</div>;
  }

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated: !!token, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
