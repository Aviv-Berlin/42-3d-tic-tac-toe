import { createContext, useContext, useState } from 'react'
import { PropsWithChildren } from 'react'

interface UsernameContextType {
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
}

const UsernameContext = createContext<UsernameContextType | null>(null);

const UsernameProvider = ({children}: PropsWithChildren) => {
  const [username, setUsername] = useState<string | null>(null);

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
}

const useUsername = () => useContext(UsernameContext);

export { UsernameProvider, useUsername }
