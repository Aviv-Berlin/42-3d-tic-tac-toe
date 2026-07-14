import { createContext, useContext, useState } from 'react'

const UsernameContext = createContext(null);

const UsernameProvider = ({children}) => {
  const [username, setUsername] = useState(null);

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
}

const useUsername = () => useContext(UsernameContext);

export default { UsernameProvider, useUsername }
