import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

function NavigationBar() {

  return (
    <Navbar expand="lg" className="site-header py-2">
      <Container>
        <Navbar.Brand as={Link} to="/" className="me-3">
          <img src={logo} alt="Agnes & Alois Youth Guild Logo" />
          <div className="brand-text">
            <strong>Archdiocese of Harare</strong>
            <span>Roman Catholic Church</span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="align-items-lg-center ms-auto navbar-shell">
            <NavLink to="/parishes" className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}>
              Parishes
            </NavLink>

            <NavLink to="/deaneries" className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}>
              Deaneries
            </NavLink>

            <NavLink to="/" className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}>
              About the Archdiocese
            </NavLink>
            <NavLink to="/leadership" className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}>
              Leadership
            </NavLink>
            <NavLink to="/ministries" className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}>
              Ministries
            </NavLink>
            <NavLink to="/news" className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}>
              News
            </NavLink>
            <NavLink to="/events" className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}>
              Events
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}>
              Gallery
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}>
              Contact
            </NavLink>

            <NavLink to="/join" className="join-link mt-2 mt-lg-0">
              Join Us
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;