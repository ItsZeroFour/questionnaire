import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import Header from "../../components/Header";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

const Home = ({ userData }) => {
  const [disciplines, setDisciplines] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserDisciplines = async () => {
      try {
        const data = await axios.get("/discipline/get-discuplines");

        if (data.status === 200) {
          setDisciplines(data.data);
        }
      } catch (err) {
        alert("Не удалось получить дисциплины пользователя");
      }
    };

    getUserDisciplines();
  }, []);

  return (
    <section className={style.home}>
      <Header />

      <div className={style.home__wrapper}>
        <div className={style.home__left__wrapper}>
          <aside className={style.home__left}>
            <h3>Доступные вам дисциплины</h3>

            {!disciplines &&
            disciplines !== null &&
            disciplines.length !== 0`` ? (
              <div className={style.home__disciplines__wrapper}>
                <ul className={style.home__disciplines__loading}>
                  {[1, 2, 3, 4, 5].map((item, index) => (
                    <li key={index}></li>
                  ))}
                </ul>
              </div>
            ) : (
              <ul className={style.home__disciplines__loading}>
                {disciplines !== null &&
                  disciplines.map((item) => (
                    <Link to="">
                      <li key={item._id}>
                        <h3>{item.title}</h3>
                        <p>
                          {item.description.length > 100
                            ? `${item.description.slice(0, 100)}...`
                            : item.description}
                        </p>

                        <p>Всего участников: {item.members.length}</p>
                      </li>
                    </Link>
                  ))}
              </ul>
            )}
          </aside>
        </div>
        <aside className={style.home__right}>
          <h2>
            ДОБРО ПОЖАЛОВАТЬ, <br />{" "}
            <span>
              {userData.firstName} {userData.lastName}
            </span>{" "}
            👋
          </h2>

          <div className={style.home__right__text}>
            <p>
              Успех — это не конечный пункт назначения, а путь, который мы
              создаём своими усилиями, терпением и верой в себя. Каждый шаг
              вперёд — это уже победа.
            </p>
          </div>

          {userData.discipline !== "Cтудент" && userData.verifyDiscipline && (
            <div className={style.home__right__button}>
              <button onClick={() => navigate("/panel")}>
                Панель управления
              </button>
            </div>
          )}

          <ul>
            <li>
              <p>Тестов пройдено: 240</p>
            </li>

            <li>
              <p>Вы состоите в 3 дисциплинах</p>
            </li>
          </ul>

          <p>
            Приложение разработано студентами группы ИВТ-б-о-242 и ИВТ-б-о-241
            КФУ.{" "}
            <Link to="https://github.com/ItsZeroFour/questionnaire/blob/main/README.md">
              Подробнее
            </Link>
          </p>
        </aside>
      </div>
    </section>
  );
};

export default Home;
