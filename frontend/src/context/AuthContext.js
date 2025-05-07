import { useEffect, useState, createContext, useContext } from "react";
import { auth } from "../lib/firebase";  // Assuming Firebase is configured
import { signOut } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || "No Name",
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  const login = (username, uid) => {
    setUser({ name: username, uid });
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await signOut(auth); // 🔴 LOG OUT from Firebase
      setUser(null);
      setIsAuthenticated(false);
      setTasks([]);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const addTask = (task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, login, logout, tasks, addTask }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
