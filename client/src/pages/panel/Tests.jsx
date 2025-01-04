import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

const Tests = ({ userData }) => {
  const [discipline, setDiscipline] = useState("");
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      userData &&
      userData.discipline === "Алгоритмизация и программирование"
    ) {
      setDiscipline("6771329c02d9e946ad847b77");
    } else {
      return navigate("/");
    }
  }, [userData]);

  useEffect(() => {
    const getTests = async () => {
      try {
        if (discipline) {
          setLoading(true);

          const response = await axios.get(
            `/discipline/get-all-tests/${discipline}`
          );

          if (response.status === 200) {
            setTests(response.data.reverse());
          }

          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
        alert("Не удалось получить тесты");
      }
    };

    getTests();
  }, [discipline]);

  const deleteTest = async (id) => {
    try {
      if (tests) {
        const deleteTest = await axios.delete(`/discipline/delete-test/${id}`);

        if (deleteTest.status === 200) {
          const filterTests = tests.filter((test) => test._id !== id);

          setTests(filterTests);

          alert("Успешно");
        }
      }
    } catch (err) {
      console.log(err);
      alert("Не удалось удалить тест");
    }
  };

  return (
    <section className={style.tests}>
      <Link to="/">Вернутся домой</Link>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <React.Fragment>
          {tests && tests !== null ? (
            <ul>
              {tests.map((item) => (
                <li key={item._id}>
                  <div>
                    <h1>{item.title}</h1>
                    <p>{item.description}</p>
                  </div>

                  <button onClick={() => deleteTest(item._id)}>Удалить</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Не удалось загурзить тесты</p>
          )}
        </React.Fragment>
      )}
    </section>
  );
};

export default Tests;
