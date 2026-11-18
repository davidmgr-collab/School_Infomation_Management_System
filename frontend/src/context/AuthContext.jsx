
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

import api, { getResponseData } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Normalize user information returned by the backend.
function normalizeUser(user) {
  if (!user) return null;

  const roleValue =
    user.role?.role_name ||
    user.role?.name ||
    user.role_name ||
    user.roleName ||
    user.role ||
    '';

  return {
    ...user,
    role: String(roleValue).trim().toLowerCase()
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the user's session when the application starts.
  useEffect(() => {
    const token = localStorage.getItem('sims_token');

    if (!token) {
      setLoading(false);
      return;
    }

    api.get('/auth/profile')
      .then((res) => {
        const response = getResponseData(res);
        const profile = response?.user || response;

        setUser(normalizeUser(profile));
      })
      .catch((error) => {
        console.error('Session verification failed:', error);

        localStorage.removeItem('sims_token');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Login user.
  const login = async (credentials) => {
    const response = getResponseData(
      await api.post('/auth/login', credentials)
    );

    if (!response?.token || !response?.user) {
      throw new Error('Invalid login response from server.');
    }

    const loggedInUser = normalizeUser(response.user);

    localStorage.setItem('sims_token', response.token);
    setUser(loggedInUser);

    return loggedInUser;
  };

  // Logout user.
  const logout = () => {
    localStorage.removeItem('sims_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
