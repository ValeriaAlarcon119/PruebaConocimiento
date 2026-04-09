import React, { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [globalSearchQuery, setGlobalSearchQuery] = useState('');

    return (
        <SearchContext.Provider value={{ globalSearchQuery, setGlobalSearchQuery }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);
