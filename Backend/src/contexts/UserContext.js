import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {getCurrentUser, loginAccount, logoutAccount, registerAccount, updateAccount} from '../services/authApi';
import {setAuthToken} from '../services/apiClient';

const UserContext = createContext();
const TOKEN_KEY = 'note2flash:auth-token';

export function UserProvider({children}) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (!savedToken) return;

        setAuthToken(savedToken);
        const response = await getCurrentUser();
        if (isMounted) {
          setToken(savedToken);
          setUser(response.user);
        }
      } catch (error) {
        setAuthToken(null);
        await AsyncStorage.removeItem(TOKEN_KEY).catch(() => {});
      } finally {
        if (isMounted) setIsRestoringSession(false);
      }
    };

    restoreSession();
    return () => { isMounted = false; };
  }, []);

  const persistSession = useCallback(async response => {
    setAuthToken(response.token);
    await AsyncStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);
    setUser(response.user);
    return response.user;
  }, []);

  const login = useCallback(async credentials => persistSession(await loginAccount(credentials)), [persistSession]);
  const register = useCallback(async details => persistSession(await registerAccount(details)), [persistSession]);

  const logout = useCallback(async () => {
    try {
      if (token) await logoutAccount();
    } catch (error) {
      // Clear the local session even if the server is unreachable.
    } finally {
      setAuthToken(null);
      await AsyncStorage.removeItem(TOKEN_KEY).catch(() => {});
      setToken(null);
      setUser(null);
    }
  }, [token]);

  const saveProfile = useCallback(async details => {
    const response = await updateAccount(details);
    setUser(response.user);
    return response.user;
  }, []);

  return (
    <UserContext.Provider value={{user, token, isRestoringSession, login, register, logout, saveProfile}}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
