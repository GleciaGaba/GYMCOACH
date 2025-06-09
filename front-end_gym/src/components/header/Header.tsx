// src/components/header/Header.tsx
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Header.css";

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="glass-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Gym Coach App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            {!user && (
              <>
                {location.pathname === "/login" ? (
                  <Nav.Link as={Link} to="/signup">
                    SignUp
                  </Nav.Link>
                ) : (
                  <Nav.Link as={Link} to="/login">
                    Login
                  </Nav.Link>
                )}
              </>
            )}
            {user?.role === "COACH" && (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  Mon Espace Coach
                </Nav.Link>
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              </>
            )}
            {user?.role === "SPORTIF" && (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  Mon Espace Sportif
                </Nav.Link>
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              </>
            )}
            {user?.role === "ADMIN" && (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  Admin Panel
                </Nav.Link>
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
