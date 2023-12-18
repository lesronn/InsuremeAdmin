// YourComponent.js
import React, { useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { AuthData } from "../../auth/AuthWrapper";
import { nav } from "./navigation";
import "./menu.css"; // Import the styles
import colors from "../../config/colors";

const RenderRoutes = () => {
  const { user } = AuthData();

  return (
    <Routes>
      {nav.map((r, i) => {
        if (user.isAuthenticated) {
          return <Route key={i} path={r.path} element={r.element} />;
        } else return false;
      })}
    </Routes>
  );
};

const MenuItem = ({ r }) => {
  const location = useLocation();
  const isActive = location.pathname === r.path;
  return (
    <div className={`menuItem ${isActive ? "active" : ""}`}>
      <NavLink
        to={r.path}
        style={{ color: isActive ? colors.white : colors.primaryText }}
      >
        {r.name}
      </NavLink>
    </div>
  );
};

const RenderMenu = () => {
  const { user, logout } = AuthData();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      logout();
      setLoading(false);
    }, 500);
  };
  return (
    <div
      className="sidebar"
      style={{ backgroundColor: colors.white, color: colors.primaryText }}
    >
      <div className="sidebar-heading">
        Insure<span style={{ color: colors.primary }}>M</span>e
      </div>

      {nav.map((r, i) => {
        if ((!r.isPrivate || user.isAuthenticated) && r.isMenu) {
          return <MenuItem key={i} r={r} />;
        } else return null;
      })}

      <div className="menuItem logout">
        <button
          style={{
            backgroundColor: colors.primaryBtn,
          }}
          className="log"
          onClick={handleLogout}
        >
          {loading ? <div className="spinner"></div> : "Log out"}
        </button>
      </div>
    </div>
  );
};

export { RenderRoutes, RenderMenu };
