import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RenderMenu,
  RenderRoutes,
} from "../components/structure/RenderNavigation";
import Login from "../components/pages/Login";
// import { Login } from "../components/pages/Login";

const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    // Initialize user state from local storage if available
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : { name: "", isAuthenticated: false };
  });

  useEffect(() => {
    // Save user to local storage whenever it changes
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const login = (userName, password) => {
    // Make a call to the authentication API to check the username

    return new Promise((resolve, reject) => {
      if (password === "admin") {
        const newUser = { name: userName, isAuthenticated: true };
        console.log(newUser.name);
        setUser(newUser);
        resolve("success");
        navigate("/"); // Redirect to dashboard or another route after successful login
      } else {
        reject("Incorrect password");
      }
    });
  };

  const logout = () => {
    setUser({ name: "", isAuthenticated: false });
    navigate("/login"); // Redirect to login route after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <>
        {user.isAuthenticated ? (
          <>
            <RenderMenu />
            <RenderRoutes />
          </>
        ) : (
          <Login />
        )}
      </>
    </AuthContext.Provider>
  );
};
