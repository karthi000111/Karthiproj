import React, {createContext, useContext, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export function ThemeProvider({children}) {
  const [isDark, setIsDark] = useState(false);
  React.useEffect(() => {
    AsyncStorage.getItem('note2flash:theme')
      .then(savedTheme => {
        if (savedTheme !== null) setIsDark(savedTheme === 'dark');
      })
      .catch(() => {});
  }, []);
  const toggleTheme = () => setIsDark(value => {
    const nextValue = !value;
    AsyncStorage.setItem('note2flash:theme', nextValue ? 'dark' : 'light').catch(() => {});
    return nextValue;
  });
  const theme = useMemo(() => ({background: isDark ? '#172B4D' : '#F5F7FA', card: isDark ? '#243B5A' : '#FFFFFF', text: isDark ? '#FFFFFF' : '#172B4D'}), [isDark]);
  return <ThemeContext.Provider value={{isDark, theme, toggleTheme}}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
