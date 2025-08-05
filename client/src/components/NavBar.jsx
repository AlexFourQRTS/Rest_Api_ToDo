import React from "react";
import { routes } from "../routes";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useLocalization from "../hooks/useLocalization";

const NavBar = ({ token, role, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Используем хук локализации
  const { t, isInitialized } = useLocalization();

  const handleLogoutClick = () => {
    onLogout();
    navigate(routes.home);
  };

  const isActive = (path) => {
    return currentPath === path ? "active" : "";
  };

  // Показываем загрузку пока локализация не инициализирована
  if (!isInitialized) {
    return (
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} to={routes.home}>
            Rest ToDo Api
          </Navbar.Brand>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to={routes.home}>
          Rest ToDo Api
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to={routes.home}
              className={isActive(routes.home)}
            >
              {t('home')}
            </Nav.Link>
            {token ? (
              <>
                {role === "admin" && (
                  <>
                    <Nav.Link
                      as={Link}
                      to={routes.admin}
                      className={isActive(routes.admin)}
                    >
                      {t('admin')}
                    </Nav.Link>
                  </>
                )}
                {role === "user" && (
                  <Nav.Link
                    as={Link}
                    to={routes.user}
                    className={isActive(routes.user)}
                  >
                    {t('user')}
                  </Nav.Link>
                )}
                <Button variant="outline-danger" onClick={handleLogoutClick}>
                  {t('logout')}
                </Button>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to={routes.login}
                  className={isActive(routes.login)}
                >
                  {t('login')}
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to={routes.register}
                  className={isActive(routes.register)}
                >
                  {t('register')}
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
