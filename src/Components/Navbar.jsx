import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar";
import logoImage from "../assets/nexgen.png";
import { Menu, X } from "lucide-react";

// 🔥 Accept 'hideNavbar' as a prop
const Navbar = ({ hideNavbar }) => {
  const location = useLocation();
  const path = location.pathname;

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hideNavbarPaths = [
    "/dashboard",
    "/dashboard/Owner",
    "/dashboard/admin",
    "/dashboard/blogger",
    "/Owner",
    "/admin",
    "/blogger",
  ];

  // ✅ Hide navbar if modal is open or route matches
  if (hideNavbar || hideNavbarPaths.some((p) => path.startsWith(p))) return null;

  const getActive = (path) => {
    switch (path) {
      case "/":
      case "/Home":
        return "HOME";
      case "/AboutUs":
        return "AboutUs";
      case "/Event":
        return "Event";
      case "/Blog":
        return "BLOG";
      case "/Gallery":
        return "Gallery";
      case "/PartnershipSection":
        return "PartnershipSection";
      default:
        return "";
    }
  };

  const active = getActive(location.pathname);

  return (
    <div className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-page">
        <div className="n-logo">
          <img src={logoImage} alt="NexGenCyberWomen Logo" className="logo-image" />
          NexGen <br /> CyberWomen
        </div>
      </div>

      {/* Desktop Links */}
      <div className={`navbar-right ${menuOpen ? "open" : ""}`}>
        <Link to="/Home" className={`navbar-item ${active === "HOME" ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/AboutUs" className={`navbar-item ${active === "AboutUs" ? "active" : ""}`} onClick={() => setMenuOpen(false)}>AboutUs</Link>
        <Link to="/Event" className={`navbar-item ${active === "Event" ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Events</Link>
        <Link to="/Blog" className={`navbar-item ${active === "BLOG" ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Blog</Link>
        <Link to="/Gallery" className={`navbar-item ${active === "Gallery" ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Gallery</Link>
        {/* <Link to="/PartnershipSection" className={`navbar-item ${active === "PartnershipSection" ? "active" : ""}`} onClick={() => setMenuOpen(false)}>Partner</Link> */}
      </div>

      {/* Mobile Menu Icon */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </div>
    </div>
  );
};

export default Navbar;
