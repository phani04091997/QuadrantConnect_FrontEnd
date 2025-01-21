import { Link } from "react-router-dom";
import { useState } from "react";
import "../css/Navbar.css";

const Navbar = ({ setUserType }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState("H1B");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleToggle = () => {
    const newUserType = selectedUserType === "H1B" ? "OPT" : "H1B";
    setSelectedUserType(newUserType);
    setUserType(newUserType); // Pass the updated user type to parent
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        <Link to="/home" className="navbar-logo">
          Quadrant Connect
        </Link>
        <button className="hamburger-menu" onClick={toggleMenu}>
          &#9776; {/* Hamburger menu icon */}
        </button>
        <ul className={`navbar-menu ${isMenuOpen ? "show" : ""}`}>
          <li>
            <Link to="/home" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/resources" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              Resources
            </Link>
          </li>
          <li>
            <Link to="/add-resource" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              Add Resource
            </Link>
          </li>
          <li>
            <Link to="/status" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              Status
            </Link>
          </li>
        </ul>
        {/* Slide Toggle */}
        <div className="toggle-container">
          <span className="toggle-label">{selectedUserType}</span>
          <div
            className={`toggle-button ${selectedUserType === "H1B" ? "active" : ""}`}
            onClick={handleToggle}
          >
            <div className="slider"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
