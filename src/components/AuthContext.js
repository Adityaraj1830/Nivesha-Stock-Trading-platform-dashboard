import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      setAuthLoading(true);

      const response = await fetch("http://localhost:3002/auth/me", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setUser(null);
        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error("AUTH CHECK ERROR:", error);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:3002/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    } finally {
      setUser(null);

      window.location.replace("http://localhost:3001/login");
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.replace("http://localhost:3001/login");
    }
  }, [authLoading, user]);

  if (authLoading) {
    return (
      <div className="nivesha-auth-loading">
        <div className="nivesha-auth-loader"></div>

        <h2>Nivesha</h2>

        <p>Securing your trading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export default AuthContext;
