import { Route, Routes, useNavigate } from "react-router-dom";
import Register from "./pages/register/Register";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/home/Home";

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
  }, []);

  useEffect(() => {
    if (findUserProcess === false && !userData?._id) {
      return navigate("/register");
    }
  }, [findUserProcess]);

  return (
    <div className="page">
      <div className="container">
        <main>
          {!findUserProcess ? (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
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
