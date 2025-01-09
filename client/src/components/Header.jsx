import React from "react";
import style from "./style.module.scss";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";

const Header = () => {

  const signout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  }

  return (
    <header className={style.header}>
      <div className={style.header__logo}>
        <img src={logo} alt="logo" />
        <p>Questionnaire</p>
      </div>

      <div>
        <button onClick={signout}>Выйти из аккаунта</button>
      </div>
    </header>
  );
};

export default Header;
