import dotenv from "dotenv";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();

const SECRET = process.env.SECRET;

/* Mail */
const transporter = nodemailer.createTransport({
  service: "Yandex",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

function generateUniqueCode() {
  return crypto.randomBytes(3).toString("hex"); // 6-значный уникальный код
}

export const registerUser = async (req, res) => {
  try {
    const findUser = await UserModel.findOne({ email: req.body.email });

    if (findUser) {
      return res.status(400).json({
        message: "Такой пользователь уже существует",
      });
    }

    if (
      !req.body.password ||
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.discipline
    ) {
      return res.status(400).json({
        message: "Заполните все обязательные поля",
      });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      discipline: req.body.discipline,
      password: hashPassword,
    });

    const user = await doc.save();

    const verificationCode = generateUniqueCode();

    try {
      // Отправка email
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: req.body.email,
        subject: "Код верификации",
        text: `Ваш код верификации: ${verificationCode}`,
      });

      await UserModel.findOneAndUpdate(
        { email: req.body.email },
        { verificationCode, verified: false }
      );

      return res.status(200).json({
        message: "Код успешно отправлен на вашу почту",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send verification code" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Ошибка при регистрации пользователя",
    });
  }
};

export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: "Email and code are required" });
    }

    try {
      const user = await UserModel.findOne({ email });

      if (user && user.verificationCode === code) {
        user.verified = true;

        const token = jwt.sign(
          {
            _id: user._id,
          },
          SECRET,
          {
            expiresIn: "7d",
          }
        );

        await user.save();

        res.json({ ...user, token });
      } else {
        res.status(400).json({ error: "Invalid verification code" });
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      res.status(500).json({ error: "Failed to verify code" });
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({
      message: "Не удалось проверить код авторизации",
    });
  }
};

export const authUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.userId });

    if (!user) {
      res.status(404).json({
        message: "Пользователь не найден!",
      });

      return;
    }

    const { password, ...userData } = user._doc;

    return res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось войти",
    });
  }
};
