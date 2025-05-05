import { createContext, useContext } from 'react';
import { useState } from 'react';

const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: ''
  });

  return (
    <ItemContext.Provider value={{
      searchQuery,
      setSearchQuery,
      filters,
      setFilters
    }}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItemFilters = () => useContext(ItemContext);