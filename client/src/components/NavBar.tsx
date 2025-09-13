import React from "react";
import { Link } from "react-router-dom";

export const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">SuperheroDB</div>
      <div className="navbar-menu">
        <Link to="/">Home</Link>
        <Link to="/admin">Admin</Link>
      </div>
    </nav>
  );
};

export default NavBar;
