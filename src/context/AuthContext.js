import React, { createContext, useContext, useState } from 'react';

const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(userData) {
    setUser(userData);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
