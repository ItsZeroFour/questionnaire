import { Route, Routes, useNavigate } from "react-router-dom";
import Register from "./pages/register/Register";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/home/Home";
import SignIn from "./pages/signin/SignIn";
import Panel from "./pages/panel/Panel";
import CreateTest from "./pages/panel/CreateTest";
import Test from "./pages/test/Test";

function App() {
  const [findUserProcess, setFindUserProcess] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      try {
        setFindUserProcess(true);
        const user = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/user/me`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );

        setFindUserProcess(false);
        setUserData(user.data);
      } catch (err) {
        setFindUserProcess(false);
      }
    }

    getUser();
  }, [localStorage.getItem("token")]);

  useEffect(() => {
    if (findUserProcess === false && !userData?._id) {
      return navigate("/register");
    }
  }, [findUserProcess]);

  return (
    <div className="page">
      <div className="container">
        {userData !== null &&
          userData.discipline !== "Студент" &&
          userData.verifyDiscipline === false && (
            <div className="status">
              <div className="status__wrapper">
                <h2>Ожидайте подтверждение статуса преподавателя</h2>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.reload();
                  }}
                >
                  Выйти из аккаунта
                </button>
              </div>
            </div>
          )}
        <main>
          {!findUserProcess ? (
            <Routes>
              {!(
                userData !== null &&
                userData.discipline !== "Студент" &&
                userData.verifyDiscipline === false
              ) && (
                <>
                  <Route
                    path="/"
                    element={<Home userData={userData !== null && userData} />}
                  />

                  <Route path="/panel" element={<Panel />} />
                  <Route
                    path="/create-test"
                    element={<CreateTest userData={userData} />}
                  />
                  <Route
                    path="/test/:id"
                    element={<Test userData={userData} />}
                  />
                </>
              )}

              <Route path="/register" element={<Register />} />
              <Route path="/signin" element={<SignIn />} />
            </Routes>
          ) : (
            <p>Загрузка...</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
