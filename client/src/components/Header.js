import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import "./css/Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { id: 1, name: "Home", href: "#" },
    { id: 2, name: "About", href: "#" },
    { id: 3, name: "Services", href: "#" },
    { id: 4, name: "Pricing", href: "#" },
    { id: 5, name: "Blog", href: "#" },
    { id: 6, name: "Supplier", href: "#" },
    { id: 7, name: "Buyer", href: "#" },
    { id: 8, name: "Support", href: "#" },
    { id: 9, name: "Contact", href: "#" }
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
          </div>
        </div>
      </header>

      
    
  );
};

export default Header;
