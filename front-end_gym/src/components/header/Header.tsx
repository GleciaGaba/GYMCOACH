// src/components/layout/Header.tsx
import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useAuth } from '../../contexts/AuthContext'

const Header: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Gym Coach App</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            {!user && (
              <>
                <LinkContainer to="/login"><Nav.Link>Login</Nav.Link></LinkContainer>
                <LinkContainer to="/signup"><Nav.Link>Sign Up</Nav.Link></LinkContainer>
              </>
            )}
            {user?.role === 'COACH' && (
              <>
                <LinkContainer to="/coach"><Nav.Link>Dashboard</Nav.Link></LinkContainer>
                <LinkContainer to="/coach/clients"><Nav.Link>My Clients</Nav.Link></LinkContainer>
                <LinkContainer to="/coach/sessions"><Nav.Link>Sessions</Nav.Link></LinkContainer>
              </>
            )}
            {user?.role === 'SPORTIF' && (
              <>
                <LinkContainer to="/sportif"><Nav.Link>Mes Séances</Nav.Link></LinkContainer>
                <LinkContainer to="/sportif/progress"><Nav.Link>Progression</Nav.Link></LinkContainer>
              </>
            )}
            {user?.role === 'ADMIN' && (
              <LinkContainer to="/admin"><Nav.Link>Admin Panel</Nav.Link></LinkContainer>
            )}
            {user && (
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
