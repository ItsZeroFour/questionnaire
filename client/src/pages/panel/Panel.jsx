import React from "react";
import style from "./style.module.scss";
import { useNavigate } from "react-router-dom";

const Panel = () => {
  const navigate = useNavigate();

  return (
    <section className={style.panel}>
      <h2>Панель управления</h2>
      <button
        className={style.panel__button}
        onClick={() => navigate("/create-test")}
      >
        Создать тест
      </button>

      <button
        className={style.panel__button}
        onClick={() => navigate("/tests")}
      >
        Мои тесты
      </button>

      <button
        className={style.panel__button}
        onClick={() => navigate("/add-members")}
      >
        Добавить участников в дисциплину
      </button>
    </section>
  );
};

export default Panel;
