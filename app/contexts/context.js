"use client";
import { createContext, useState } from "react";

const noteContext = createContext();

const ContextProvider = ({ children }) => {
  const [editFlag, setEditFlag] = useState(false);
  const [query, setQuery] = useState(false);
  const formData = {
    title: " ",
    body: " ",
    category: " ",
  };

  return (
    <noteContext.Provider value={{ query, setQuery, formData }}>
      {children}
    </noteContext.Provider>
  );
};

export { ContextProvider, noteContext };
