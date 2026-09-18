import React, {createContext, useContext, useState} from 'react';

const UserContext = createContext();

export function UserProvider({children}) {
  const [user, setUser] = useState({name: 'Karthi', email: 'karthi@example.com'});
  return <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
