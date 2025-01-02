import React from "react";
import style from "./style.module.scss";
import logo from "../assets/logo.svg";

const Header = () => {
  return (
    <header className={style.header}>
      <div className={style.header__logo}>
        <img src={logo} alt="logo" />
        <p>Questionnaire</p>
      </div>
    </header>
  );
};

export default Header;
