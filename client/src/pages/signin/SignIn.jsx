import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [quote, setQuote] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkCodeProcess, setCheckCodeProcess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage2, setErrorMessage2] = useState("");

  const navigate = useNavigate();

  function getRandomElement(arr) {
    if (arr.length === 0) {
      throw new Error("Массив пустой, невозможно выбрать случайный элемент.");
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  // Пример использования
  const quotes = [
    "Чтобы понять общественное мнение, нужно осознавать, что каждая анкета — это не просто набор вопросов. Это мост между исследователем и респондентом. Если этот мост построен с ошибками — недоверие, путаница или недостаточная ясность — он неизбежно приведет к искажению данных. Только точные, нейтральные и понятные вопросы могут раскрыть истинные убеждения и предпочтения людей",
    "Результаты опросов — это не статичный снимок реальности, а отражение множества движущихся частей. Они зависят от контекста, настроения респондентов, способа формулировки вопросов и даже того, как проводился сам опрос. Именно поэтому важно относиться к данным с осторожностью и использовать их как инструмент анализа, а не окончательную истину",
    "Часто считается, что результаты опросов отражают то, что думают люди, но это не совсем так. Они показывают то, что люди готовы озвучить в конкретный момент времени, в условиях определённой анкеты. Настоящая задача исследователя — найти способ преодолеть барьеры: социальные, когнитивные и эмоциональные, чтобы выявить искренние чувства и мнения",
    "Опросы — это искусство и наука одновременно. Искусство состоит в способности задавать правильные вопросы, которые не вводят респондентов в заблуждение. Наука — в использовании методов, позволяющих интерпретировать результаты с высокой точностью. Без этой двойственности опросы становятся бесполезным набором цифр, лишённых контекста и смысла",
    "Люди склонны верить цифрам и диаграммам, которые представляют результаты опросов, не задумываясь о методах, стоящих за ними. Но каждый опрос скрывает множество тонких нюансов: от выбора выборки до порядка вопросов. Только детальное изучение этих деталей позволяет понять истинную ценность и ограниченность полученных данных",
  ];

  useEffect(() => {
    const randomElement = getRandomElement(quotes);
    setQuote(randomElement);
  }, []);

  const loginUser = async () => {
    try {
      if (!email || !password) {
        return setErrorMessage2("Заполните все обязательные поля!");
      }

      setProcessing(true);
      const registerUser = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user/login`,
        {
          email,
          password,
        }
      );

      setProcessing(false);
      setErrorMessage2("");

      setErrorMessage(registerUser?.message);

      if (registerUser.status === 200) {
        setSuccess(true);
      }
    } catch (err) {
      setProcessing(false);
      console.log(err);
      alert(errorMessage ? errorMessage : "Произошла ошибка при авторизации");
    }
  };

  const verifyCode = async () => {
    try {
      if (!code) {
        return setErrorMessage2("Заполните все обязательные поля!");
      }

      setCheckCodeProcess(true);
      const verify = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user/verifyCode`,
        { email, code }
      );

      setCheckCodeProcess(false);
      setErrorMessage2("");

      if (verify.status === 200) {
        if ("token" in verify.data) {
          window.localStorage.setItem("token", verify.data.token);
        }

        return navigate("/");
      } else if (verify.status === 400) {
        alert("Не верный код");
      }
    } catch (err) {
      console.log(err);
      setCheckCodeProcess(false);
      alert("Не верный код");
    }
  };

  return (
    <section className={style.signin}>
      <aside className={style.signin__left}>
        <h1>Questionnaire</h1>
        <p>{quote}</p>
      </aside>
      {!success ? (
        <aside className={style.signin__right}>
          <h2>Войти в аккаунт</h2>

          <form>
            <input
              type="text"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="E-mail"
            />
            <input
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Пароль"
            />
          </form>

          {errorMessage2 && (
            <p className={style.signin__error}>{errorMessage2}</p>
          )}

          <button type="button" onClick={loginUser}>
            {processing ? "Подождите..." : "Войти в аккаунт"}
          </button>
        </aside>
      ) : (
        <aside className={style.register__right}>
          <div className={style.register__right__wrapper}>
            <h2>Введите код</h2>
            <p>
              На вашу почту {email} был отправлен код авторизации. Пожалуйста,
              введите его
            </p>

            <input
              type="text"
              onChange={(event) => setCode(event.target.value)}
              placeholder="1abc009"
            />

            {errorMessage2 && (
              <p className={style.signin__error}>{errorMessage2}</p>
            )}

            <button
              type="button"
              disabled={checkCodeProcess}
              onClick={verifyCode}
            >
              {checkCodeProcess ? "Подождите..." : "Войти"}
            </button>
          </div>
        </aside>
      )}
    </section>
  );
};

export default SignIn;
