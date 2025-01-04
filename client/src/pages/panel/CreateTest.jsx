import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import axios from "../../utils/axios";
import { Link, useNavigate } from "react-router-dom";

const CreateTest = ({ userData }) => {
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: [""],
      correctAnswer: "",
    },
  ]);
  const [students, setStudents] = useState(null);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);
  const [acceptable, setAcceptable] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discipline, setDiscipline] = useState("");

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

  const handleQuestionTextChange = (id, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, questionText: value } : q))
    );
  };

  const handleOptionChange = (id, optionIndex, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const addOption = (id) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, options: [...q.options, ""] } : q))
    );
  };

  const removeOption = (id, optionIndex) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              options:
                q.options.length > 1
                  ? q.options.filter((_, i) => i !== optionIndex)
                  : q.options,
            }
          : q
      )
    );
  };

  const handleCorrectAnswerChange = (id, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, correctAnswer: value } : q))
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: Date.now().toString(16),
        questionText: "",
        options: [""],
        correctAnswer: "",
      },
    ]);
  };

  const renderQuestionsJSON = () => {
    return questions.map(({ id, questionText, options, correctAnswer }) => ({
      questionText,
      options,
      correctAnswer,
      id: id,
    }));
  };

  const getAllStudents = async () => {
    try {
      setIsStudentsLoading(true);
      const getStudents = await axios.get(
        "/discipline/get-members/6771329c02d9e946ad847b77"
      );
      setIsStudentsLoading(false);

      setStudents(getStudents.data);
    } catch (err) {
      console.log(err);
      setIsStudentsLoading(false);
      alert("Не удалось получить студентов");
    }
  };

  useEffect(() => {
    getAllStudents();
  }, []);

  const createTest = async () => {
    try {
      if (
        title === "" ||
        questions[0].title === "" ||
        questions[0].options.length <= 1
      ) {
        return alert("Заполните все поля");
      }

      const createTest = await axios.post("/discipline/create-test", {
        title: title,
        description: description,
        questions: renderQuestionsJSON(),
        acceptable: acceptable,
        disciplineId: discipline,
      });

      if (createTest.status === 201) {
        alert("Тест успешно создан");
        navigate(`/test/${createTest.data._id}`);
      }
    } catch (err) {
      console.log(err);
      alert("Не удалось создать тест");
    }
  };

  function checkElementInArrayIncludes(array, element) {
    if (!Array.isArray(array)) {
      return false;
    }
    return array.includes(element);
  }

  return (
    <section className={style.create_test}>
      <Link to="/">Вернутся домой</Link>

      <h2>Создать тест</h2>

      <input
        type="text"
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Название теста"
      />
      <textarea
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Описание"
      ></textarea>

      {questions.map((question) => (
        <div key={question.id} className={style.create_test__question}>
          <input
            type="text"
            placeholder="Введите текст вопроса"
            value={question.questionText}
            onChange={(e) =>
              handleQuestionTextChange(question.id, e.target.value)
            }
          />

          <div className={style.create_test__options}>
            {question.options.map((option, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="text"
                  placeholder={`Вариант ответа ${index + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(question.id, index, e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => removeOption(question.id, index)}
                  style={{ marginLeft: "10px" }}
                >
                  Удалить
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addOption(question.id)}>
              Добавить вариант ответа
            </button>
          </div>

          <input
            type="text"
            placeholder="Введите правильный ответ"
            value={question.correctAnswer}
            onChange={(e) =>
              handleCorrectAnswerChange(question.id, e.target.value)
            }
          />
        </div>
      ))}

      {/* Добавить новый вопрос */}
      <button onClick={addQuestion}>Добавить вопрос</button>

      <button onClick={createTest}>Создать тест</button>

      <div className={style.create_test__students}>
        <h2>Студенты</h2>
        <p>Добавьте студентов, которые должны получит доступ к тесту</p>
        {students !== null && (
          <React.Fragment>
            {isStudentsLoading === true ? (
              <p>Загрузка студентов...</p>
            ) : (
              <React.Fragment>
                {students.length === 0 ? (
                  <p>Список студентов пуст.</p>
                ) : (
                  <ul>
                    {students.map((item) => (
                      <li>
                        <div className={style.create_test__name}>
                          <p>
                            {item.firstName} {item.lastName}
                          </p>
                          <p>{item.email}</p>
                        </div>

                        <button
                          onClick={() => {
                            setAcceptable(
                              (prev) =>
                                prev.includes(item._id)
                                  ? prev.filter((id) => id !== item._id) // Удаление
                                  : [...prev, item._id] // Добавление
                            );
                          }}
                          style={
                            checkElementInArrayIncludes(acceptable, item._id)
                              ? { background: "red" }
                              : { background: "#000" }
                          }
                        >
                          {checkElementInArrayIncludes(acceptable, item._id)
                            ? "Удалить из теста"
                            : "Добавить в тест"}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </section>
  );
};

export default CreateTest;
