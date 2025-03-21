import React from "react";
import { Link } from "react-router-dom";
import { routes } from "../routes";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./NavBar.css";

const NavBar = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary border ">
      <Container>
        <Navbar.Brand as={Link} to={routes.home}>
          Rest Api
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={routes.home}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to={routes.login}>
              Логин
            </Nav.Link>
            <Nav.Link as={Link} to={routes.register}>
              Регистрация
            </Nav.Link>
            <Nav.Link as={Link} to={routes.user}>
              Пользователь
            </Nav.Link>
            <Nav.Link as={Link} to={routes.admin}>
              Админ
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
