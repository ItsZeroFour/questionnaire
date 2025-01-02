import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axios";

const Test = ({ userData }) => {
  const [testData, setTestData] = useState(null);
  const [userId, setUserId] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setUserId(userData._id);
    }
  }, [userData]);

  const getTest = async () => {
    try {
      const getTestData = await axios.get(`/discipline/get-test/${id}`);

      setTestData(getTestData.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTest();
  }, []);

  useEffect(() => {
    if (testData !== null && userId && userData) {
      if (
        !testData.acceptable.includes(userId) &&
        userData.discipline === "Студент"
      ) {
        return navigate("/");
      }
    }
  }, [testData, userId]);

  function generateRandomString(length) {
    /**
     * Генерирует случайную строку заданной длины.
     *
     * @param {number} length Длина желаемой строки.
     * @returns {string} Случайная строка.
     */

    if (typeof length !== "number" || length < 0) {
      throw new Error("Length must be a positive number");
    }
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  console.log(testData);

  return (
    <section className={style.test}>
      <Link to="/">Вернуться домой</Link>

      <div className={style.test__container}>
        {testData ? (
          <div className={style.test__wrapper}>
            <h1>{testData.title}</h1>
            <p>{testData?.description}</p>

            <ul>
              {testData.questions.map((item) => (
                <li key={item._id}>
                  <h4>{item.questionText}</h4>

                  <div className={style.test__options}>
                    {item.options.map((item) => {
                      const id = generateRandomString(10);

                      return (
                        <div className={style.options__item}>
                          <input type="radio" name={id} />
                          <label>{item}</label>
                        </div>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ul>

            <button
              disabled={userData !== null && userData.discipline !== "Студент"}
            >
              Завершить тест
            </button>
          </div>
        ) : (
          <p>Загрузка...</p>
        )}
      </div>
    </section>
  );
};

export default Test;
