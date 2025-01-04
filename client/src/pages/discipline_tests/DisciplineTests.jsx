import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { Link, useParams } from "react-router-dom";
import axios from "../../utils/axios";

const DisciplineTests = () => {
  const [tests, setTests] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const getTests = async () => {
      try {
        const response = await axios.get(`/discipline/get-tests/${id}`);

        if (response.status === 200) {
          setTests(response.data.reverse());
        }
      } catch (err) {
        console.log(err);
      }
    };

    getTests();
  }, []);

  return (
    <section className={style.discipline_tests}>
      <Link to="/">Вернутся на главную</Link>
      <h1>Доступные вам тесты дисциплины</h1>

      {tests === null ? (
        <p>Загрузка...</p>
      ) : Array.isArray(tests) && tests.length >= 1 ? (
        <ul>
          {tests.map((item) => (
            <Link to={`/test/${item._id}`} key={item._id}>
              <li>
                <h3>{item.title}</h3>
                <p>{item.description}</p>

                <p>Участников: {item.acceptable.length}</p>
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p>Нет доступных вам тестов</p>
      )}
    </section>
  );
};

export default DisciplineTests;
