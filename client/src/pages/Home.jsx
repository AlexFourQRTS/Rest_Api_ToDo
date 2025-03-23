import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { routes } from '../routes';

const Home = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register'); 
  };

  const handleLoginClick = () => {
    navigate('/login'); 
  };
  
  return (
    <>
      <Container className="welcome-page">
        <div className="welcome-content">
          <div className="start-wrap">
            <div>Начнем?</div>
        <div className="start">
          <Button className="start-item" onClick={handleRegisterClick}> Регистрация </Button>

          <Button className="start-item" onClick={handleLoginClick} > Авторизация </Button>
        </div>
          </div>
          

          <h1>
            Техническое задание: Разработка REST API для управления списком
            задач (To-Do List)
          </h1>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>1. Введение</Accordion.Header>
              <Accordion.Body>
                <p>
                  Необходимо разработать REST API для управления списком задач.
                  API должно позволять пользователям создавать, редактировать,
                  просматривать и удалять задачи.
                </p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>2. Технологический стек</Accordion.Header>
              <Accordion.Body>
                <p>
                  Разработчик может выбрать один из следующих стеков технологий:
                </p>
                <ul>
                  <li>
                    Backend: Node.js (Express) или PHP (чистый или с
                    использованием Laravel)
                  </li>
                  <li>База данных: JSON-файл, SQLite, MySQL или MongoDB</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>3. Функционал API</Accordion.Header>
              <Accordion.Body>
                <p>Методы API:</p>
                <ul>
                  <li>POST /tasks – Создать новую задачу</li>
                  <li>GET /tasks – Получить список всех задач</li>
                  <li>
                    GET /tasks/&#123;id&#125; – Получить конкретную задачу
                  </li>
                  <li>PUT /tasks/&#123;id&#125; – Обновить задачу</li>
                  <li>DELETE /tasks/&#123;id&#125; – Удалить задачу</li>
                </ul>
                <p>Входные параметры (JSON):</p>
                <ul>
                  <li>title (string) – Заголовок задачи (обязательный)</li>
                  <li>
                    description (string) – Описание задачи (необязательный)
                  </li>
                  <li>
                    status (string) – Статус задачи (pending, in progress,
                    completed)
                  </li>
                </ul>
                <p>Выходные данные: Объект созданной задачи с id</p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>4. Frontend</Accordion.Header>
              <Accordion.Body>
                <p>
                  Простое отображение списка задач с возможностью добавления,
                  редактирования и удаления.
                </p>
                <p>
                  Можно использовать любой фреймворк (React, Vue, Angular) или
                  чистый HTML + JavaScript.
                </p>
                <p>Минимальное количество CSS, оформление не критично.</p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>5. Дополнительные требования</Accordion.Header>
              <Accordion.Body>
                <p>
                  Структурированный код: Разделить логику на файлы (контроллеры,
                  маршруты, сервисы, модели).
                </p>
                <p>
                  Аутентификация (необязательно, если сложно): Реализовать
                  JWT-аутентификацию (по желанию), чтобы пользователи могли
                  получать и изменять только свои задачи. Если JWT сложен, можно
                  обойтись без аутентификации.
                </p>
                <p>
                  Роли пользователей (дополнительно, если возможно):
                  Администратор – Полный доступ ко всем задачам. Обычный
                  пользователь – Доступ только к своим задачам.
                </p>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="5">
              <Accordion.Header>6. Требования к коду</Accordion.Header>
              <Accordion.Body>
                <p>
                  Чистота и читаемость кода. Обработчики ошибок. Минимальная
                  документация (README с инструкцией по запуску).
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </Container>
    </>
  );
};

export default Home;
