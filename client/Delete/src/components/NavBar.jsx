import React from "react";

import { routes } from "../routes";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";

const NavBar = ({ token, role, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogoutClick = () => {
    onLogout();
    navigate(routes.home);
  };

  const isActive = (path) => {
    return currentPath === path ? "active" : "";
  };

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
              Главная
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
                      Админ
                    </Nav.Link>
                  </>
                )}
                {role === "user" && (
                  <Nav.Link
                    as={Link}
                    to={routes.user}
                    className={isActive(routes.user)}
                  >
                    Пользователь
                  </Nav.Link>
                )}
                <Button variant="outline-danger" onClick={handleLogoutClick}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to={routes.login}
                  className={isActive(routes.login)}
                >
                  Авторизация
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to={routes.register}
                  className={isActive(routes.register)}
                >
                  Регистрация
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
