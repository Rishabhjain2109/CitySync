import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import "./css/Header.css";
import { Button } from "@mui/material";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login state on mount
  useEffect(() => {
    setIsVisible(true);
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    if (token || adminToken) {
      setIsLoggedIn(true);
    }
  }, []);

  // Logout function
  const logout = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("adminToken", "");
    if (localStorage.getItem("adminToken") !== "") {
      window.location.href = "/admin/login";
      return;
    }
    window.location.href = "/";
  };

  // Handle login/logout button click
  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      window.location.href = "/";
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { id: 1, name: "Home", href: "#" },
    { id: 2, name: "About", href: "#" },
    { id: 3, name: "Services", href: "#" },
    { id: 8, name: "Support", href: "#" },
    { id: 9, name: "Contact", href: "#" },
  ];

  return (
    <header className={`header ${isVisible ? "visible" : ""}`}>
      <div className="header-container">
        <div className="logo">
          <h1>CitySync</h1>
        </div>

        <nav className="nav-links">
          {navLinks.map((link) => (
            <a key={link.id} href={link.href} className="nav-link">
              {link.name}
              <span className="nav-underline" />
            </a>
          ))}
        </nav>

        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
          <FiSearch className="search-icon" />
          <Button onClick={handleAuthClick}>
            {isLoggedIn ? "Logout" : "Login"}
          </Button>
        </div>

        <div className="menu-button">
          <button onClick={toggleMenu}>
            <div className="hamburger">
              <span className={`line line1 ${isMenuOpen ? "open" : ""}`} />
              <span className={`line line2 ${isMenuOpen ? "open" : ""}`} />
              <span className={`line line3 ${isMenuOpen ? "open" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <a key={link.id} href={link.href} className="mobile-nav-link">
            {link.name}
          </a>
        ))}

        <div className="mobile-search">
          <input type="text" placeholder="Search..." className="search-input" />
          <FiSearch className="search-icon" />
          <Button onClick={handleAuthClick}>
            {isLoggedIn ? "Logout" : "Login"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
