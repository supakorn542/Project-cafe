import { createContext, useState, useContext } from 'react';

const RefreshContext = createContext({
  refresh: false,
  setRefresh: (refresh: boolean) => {},
});

export const RefreshProvider = ({ children }: { children: React.ReactNode }) => {
  const [refresh, setRefresh] = useState(false);

  return (
    <RefreshContext.Provider value={{ refresh, setRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (context === undefined) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  return context;
};