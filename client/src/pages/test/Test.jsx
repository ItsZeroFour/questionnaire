import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axios";

const Test = ({ userData }) => {
  const [testData, setTestData] = useState(null);
  const [userId, setUserId] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [correctCount, setCorrectCount] = useState(null);
  const [testCompleted, setTestCompleted] = useState(false);

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

      // Проверяем состояние теста в localStorage
      const storedCompletion = localStorage.getItem(`test_${id}_completed`);
      if (storedCompletion === "true") {
        const storedAnswers =
          JSON.parse(localStorage.getItem(`test_${id}_answers`)) || {};
        const storedCorrectCount = parseInt(
          localStorage.getItem(`test_${id}_correctCount`),
          10
        );

        setTestCompleted(true);
        setUserAnswers(storedAnswers);
        setCorrectCount(storedCorrectCount);
      }
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

  function handleAnswer(questionId, answer) {
    if (!testCompleted) {
      setUserAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: answer,
      }));
    }
  }

  function finishTest() {
    if (!testData) return;

    const correctAnswersCount = testData.questions.reduce((count, question) => {
      if (userAnswers[question._id] === question.correctAnswer) {
        return count + 1;
      }
      return count;
    }, 0);

    setCorrectCount(correctAnswersCount);
    setTestCompleted(true);

    // Сохраняем данные в localStorage
    localStorage.setItem(`test_${id}_completed`, "true");
    localStorage.setItem(`test_${id}_answers`, JSON.stringify(userAnswers));
    localStorage.setItem(
      `test_${id}_correctCount`,
      correctAnswersCount.toString()
    );
  }

  // function generateRandomString(length) {
  //   if (typeof length !== "number" || length < 0) {
  //     throw new Error("Length must be a positive number");
  //   }
  //   const characters =
  //     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  //   let result = "";
  //   for (let i = 0; i < length; i++) {
  //     const randomIndex = Math.floor(Math.random() * characters.length);
  //     result += characters.charAt(randomIndex);
  //   }
  //   return result;
  // }

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
                    {testCompleted ? (
                      <p>
                        Ваш ответ: {userAnswers[item._id]}{" "}
                        {userAnswers[item._id] === item.correctAnswer
                          ? "(Правильно)"
                          : `(Неправильно, правильный ответ: ${item.correctAnswer})`}
                      </p>
                    ) : (
                      item.options.map((option, index) => {
                        const inputId = `${item._id}-${index}`;
                        return (
                          <div key={inputId} className={style.options__item}>
                            <input
                              type="radio"
                              name={item._id}
                              value={option}
                              id={inputId}
                              onChange={() => handleAnswer(item._id, option)}
                              disabled={testCompleted}
                            />
                            <label htmlFor={inputId}>{option}</label>
                          </div>
                        );
                      })
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {!testCompleted && (
              <button
                onClick={finishTest}
                disabled={
                  userData !== null && userData.discipline !== "Студент"
                }
              >
                Завершить тест
              </button>
            )}

            {testCompleted && (
              <p>
                Вы ответили правильно на {correctCount} из{" "}
                {testData.questions.length} вопросов.
              </p>
            )}
          </div>
        ) : (
          <p>Загрузка...</p>
        )}
      </div>
    </section>
  );
};

export default Test;
