import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState([]);

  const login = (username, uid) => {
    setUser({ name: username, uid });
    setIsAuthenticated(true);
  };  

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setTasks([]);
  };

  const addTask = (task) => {
    setTasks(prevTasks => [...prevTasks, task]);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, login, logout, tasks, addTask }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
