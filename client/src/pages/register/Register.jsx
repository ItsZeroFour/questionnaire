import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { Link, useNavigate } from "react-router-dom";
import yandexLogo from "../../assets/icons/auth/yandex.png";
import githubLogo from "../../assets/icons/auth/github.png";
import axios from "axios";

const Register = () => {
  const [quote, setQuote] = useState("");
  const [openDiscuplinesList, setOpenDiscuplinesList] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [discipline, setDiscipline] = useState("Студент");
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [code, setCode] = useState("");
  const [checkCodeProcess, setCheckCodeProcess] = useState(false);

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

  const registerUser = async () => {
    try {
      setProcessing(true);
      const registerUser = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user/register`,
        {
          firstName,
          lastName,
          email,
          password,
          discipline,
        }
      );

      setProcessing(false);

      if (registerUser.status === 200) {
        setSuccess(true);
      }

      console.log(registerUser);
    } catch (err) {
      setProcessing(false);
      console.log(err);
      alert("Не удалось зарегестрироваться. Ошибка: 500");
    }
  };

  const verifyCode = async () => {
    try {
      setCheckCodeProcess(true);
      const verify = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user/verifyCode`,
        { email, code }
      );

      setCheckCodeProcess(false);

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
    <section className={style.register}>
      <aside className={style.register__left}>
        <h1>Questionnaire</h1>
        <p>{quote}</p>
      </aside>

      {!success ? (
        <aside className={style.register__right}>
          <h2>Создайте аккаунт</h2>

          <form>
            <div>
              <input
                type="text"
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Имя"
              />
              <input
                type="text"
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Фамилия"
              />
            </div>

            <div className={style.register__select}>
              <button
                type="button"
                onClick={() => setOpenDiscuplinesList(!openDiscuplinesList)}
              >
                {discipline ? discipline : "Выбирите дисциплину"}
              </button>

              {openDiscuplinesList && (
                <ul>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setDiscipline("Студент");
                        setOpenDiscuplinesList(false);
                      }}
                    >
                      Студент
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setDiscipline("Алгоритмизация и программирование");
                        setOpenDiscuplinesList(false);
                      }}
                    >
                      Алгоритмизация и программирование
                    </button>
                  </li>
                </ul>
              )}
            </div>

            <input
              type="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="E-mail"
            />
            <input
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Пароль"
            />
          </form>

          <p>
            Уже есть аккаунт? <Link to="/signin">Войти</Link>
          </p>

          <button type="button" disabled={processing} onClick={registerUser}>
            {processing ? "Подождите..." : "Зарегестрироваться"}
          </button>

          <div className={style.register__another}>
            <p>Или войдите при помощи</p>

            <ul>
              <li>
                <button>
                  <img src={yandexLogo} alt="yandex logo" />
                  <p>Войти при помощи Yandex ID</p>
                </button>
              </li>

              <li>
                <button>
                  <img src={githubLogo} alt="github logo" />
                  <p>Войти при помощи GitHub</p>
                </button>
              </li>
            </ul>
          </div>
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

export default Register;
