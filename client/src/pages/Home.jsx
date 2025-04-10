import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { routes } from "../routes";

const Home = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <>
      <Container className="welcome-page">
        <div className="welcome-content">
          <div className="start-wrap">
            <div>Начнем?</div>
            <div className="start">
              <Button className="start-item" onClick={handleRegisterClick}>
                {" "}
                Регистрация{" "}
              </Button>

              <Button className="start-item" onClick={handleLoginClick}>
                {" "}
                Авторизация{" "}
              </Button>
            </div>
          </div>

          <h1>
            <br />
            Ай посмотрим что из этого вырастит.
            <br />
          </h1>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>1.Новости </Accordion.Header>
              <Accordion.Body>
                <p>
                  Можем новостную ленту сюда подключу, просто по приколу
                </p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>2. Курс валют</Accordion.Header>
              <Accordion.Body>
                <p>
                  На главной странице, наверное прикольно
                </p>
                <ul>
                  <li>
                    А тут тебе хоп и 20 самых ходовых валют
                  </li>
                  <li>И наверное биткоин</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>3. Web-Soket</Accordion.Header>
              <Accordion.Body>
                <p>Чат:</p>
                <ul>
                  <li>Профиль</li>
                  <li>
                    Музыка
                  </li>
                  <li>Видео</li>
                  <li>Нужные программы типа 7zip</li>
                </ul>
                <p>И например классные сборки винды:</p>
                <ul>
                  <li>Картинки, не уверен что это конечно актуально</li>
                  <li>
                    Может инструкции какие-то
                  </li>
                  <li>
                    Может вцеплю сюда GPT через Api, или какой-то локальный ИИ типа Лама 3.2
                  </li>
                </ul>
                <p>Надо бы адаптив добавить, просто что бы был</p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </Container>
    </>
  );
};

export default Home;
