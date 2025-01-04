import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import axios from "../../utils/axios";
import { Link, useNavigate } from "react-router-dom";

const AddMembers = ({ userData }) => {
  const [students, setStudents] = useState(null);
  const [students2, setStudents2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);
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

  useEffect(() => {
    const getMembers = async () => {
      try {
        setLoading(true);
        const members = await axios.get("/user/get-students");

        if (members.status === 200) {
          setStudents(members.data);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        alert("Не удалось получить студентов");
      }
    };

    getMembers();
  }, []);

  const getAllStudents = async () => {
    try {
      setIsStudentsLoading(true);
      const getStudents = await axios.get(
        "/discipline/get-members/6771329c02d9e946ad847b77"
      );
      setIsStudentsLoading(false);

      setStudents2(getStudents.data);
    } catch (err) {
      console.log(err);
      setIsStudentsLoading(false);
      alert("Не удалось получить студентов");
    }
  };

  useEffect(() => {
    getAllStudents();
  }, []);

  const handleAddUser = async (id) => {
    try {
      await axios.post("/discipline/add-member", {
        userId: id,
        disciplineId: "6771329c02d9e946ad847b77",
      });
      alert("Пользователь добавлен");
      getAllStudents(); // Refresh students2 after adding
    } catch (err) {
      console.log(err);
      alert("Не удалось добавить пользователя");
    }
  };

  const handleRemoveUser = async (id) => {
    try {
      await axios.post("/discipline/remove-member", {
        userId: id,
        disciplineId: "6771329c02d9e946ad847b77",
      });
      alert("Пользователь удален");
      getAllStudents(); // Refresh students2 after removing
    } catch (err) {
      console.log(err);
      alert("Не удалось удалить пользователя");
    }
  };

  return (
    <section className={style.add_members}>
      <Link to="/">Вернутся домой</Link>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <React.Fragment>
          {students && students2 && (
            <ul>
              {students.map((item) => {
                const isInStudents2 = students2.some(
                  (student) => student._id === item._id
                );

                return (
                  <li key={item._id}>
                    <p>
                      {item.firstName} {item.lastName}
                    </p>
                    {isInStudents2 ? (
                      <button
                        onClick={() => handleRemoveUser(item._id)}
                        className={style.removeButton}
                      >
                        Удалить
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddUser(item._id)}
                        className={style.addButton}
                      >
                        Добавить
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </React.Fragment>
      )}
    </section>
  );
};

export default AddMembers;
