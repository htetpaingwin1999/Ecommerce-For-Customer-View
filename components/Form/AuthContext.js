import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [jwtToken, setJwtToken] = useState(null);

  const login = async (token) => {
    // console.log('Before setting token:', token);
    setJwtToken(token);
  };

  const logout = () => {
    setJwtToken(null);
  };

  useEffect(() => {
    // This code will run after jwtToken is updated
    // console.log('After setting token:', jwtToken);
    if (jwtToken != null) {
      debugger;
    }
  }, [jwtToken]);

  const authContextValue = {
    jwtToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}
