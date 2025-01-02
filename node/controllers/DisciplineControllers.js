import DisciplineModel from "../models/DisciplineModel.js";
import TestModel from "../models/TestModel.js";
import UserModel from "../models/UserModel.js";

/**
 * Проверяет, существует ли пользователь в массиве.
 * @param {Array} admins - Массив идентификаторов администраторов.
 * @param {string} userId - ID пользователя для проверки.
 * @returns {boolean} - Возвращает true, если пользователь существует, иначе false.
 */
export const isUserInArray = (admins, userId) => {
  if (!Array.isArray(admins)) {
    throw new Error("admins должен быть массивом");
  }
  if (typeof userId !== "string") {
    throw new Error("userId должен быть строкой");
  }
  return admins.includes(userId);
};

export const createDiscipline = async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(404).json({
        message: "Не указан заголовок дисциплины",
      });
    }

    const discipline = new DisciplineModel({
      title: req.body.title,
      description: req.body.description,
      admins: [],
      members: [],
    });

    await discipline.save();
    res.status(201).json(discipline);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось создать дисциплину" });
  }
};

export const addAdminToDiscipline = async (req, res) => {
  try {
    const userId = req.body.userId;
    const disciplineId = req.body.disciplineId;

    if (!userId || !disciplineId) {
      return res.status(403).json({
        message: "не удалось получить пользователя или дисциплину",
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const discipline = await DisciplineModel.findById(disciplineId);
    if (discipline.admins.includes(userId)) {
      return res.status(400).json({
        message: "Пользователь уже является администратором дисциплины",
      });
    }

    const updateDiscipline = await DisciplineModel.findOneAndUpdate(
      { _id: disciplineId },
      { $push: { admins: userId } },
      { new: true }
    );

    res.status(200).json(updateDiscipline);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось добавить админа",
    });
  }
};

export const addMembersToDiscipline = async (req, res) => {
  try {
    const userId = req.body.userId;
    const disciplineId = req.body.disciplineId;

    if (!userId || !disciplineId) {
      return res.status(403).json({
        message: "не удалось получить пользователя или дисциплину",
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const discipline = await DisciplineModel.findById(disciplineId);

    if (!discipline) {
      return res.status(404).json({
        message: "Дисциплина не найдена",
      });
    }

    if (discipline.members.includes(userId)) {
      return res.status(400).json({
        message: "Пользователь уже является участником дисциплины",
      });
    }

    if (isUserInArray(discipline.admins, req.userId)) {
      await DisciplineModel.findByIdAndUpdate(disciplineId, {
        $push: { members: userId },
      });

      return res.status(200).json({
        message: "Успешно!",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось добавить пользователя в дисциплину",
    });
  }
};

export const userDisciplines = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(403).json({
        message: "Не удалось получить пользователя",
      });
    }

    const disciplines = await DisciplineModel.find({
      members: { $in: [userId] },
    });

    if (!disciplines.length) {
      return res.status(200).json([]);
    }

    return res.status(200).json(disciplines);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить дисциплины пользователя",
    });
  }
};

export const createTest = async (req, res) => {
  try {
    const { disciplineId, title, questions, acceptable, description } =
      req.body;

    if (!disciplineId) {
      return res.status(403).json({
        message: "Не удалось получить дисциплину",
      });
    }

    const discipline = await DisciplineModel.findById(disciplineId);
    if (!discipline) {
      return res.status(404).json({
        message: "Дисциплина не найдена",
      });
    }

    if (!title) {
      return res.status(400).json({
        message: "Название теста обязательно",
      });
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        message: "Вопросы обязательны для создания теста",
      });
    }

    const test = new TestModel({
      title,
      description,
      questions,
      acceptable,
    });

    const savedTest = await test.save();

    if (savedTest) {
      const discipline = await DisciplineModel.findOne({ _id: disciplineId });

      if (discipline) {
        await DisciplineModel.findByIdAndUpdate(disciplineId, {
          $push: { tests: savedTest._id },
        });
      } else {
        return res.status(500).json({
          message: "Не удалось добавить тест в дисциплину",
        });
      }
    }

    res.status(201).json(savedTest);
  } catch (err) {
    console.error("Ошибка при создании теста:", err);
    res.status(500).json({
      message: "Не удалось создать тест",
    });
  }
};

export const getDisciplineTest = async (req, res) => {
  try {
    const disciplineId = req.body.disciplineId;

    if (!disciplineId) {
      return res.status(400).json({
        message: "ID дисциплины не найдено",
      });
    }

    const findDisciplineTests = await DisciplineModel.findOne({
      _id: disciplineId,
    })
      .populate("tests")
      .exec();

    return res.status(200).json(findDisciplineTests.tests);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить тесты дисциплины",
    });
  }
};

export const getTest = async (req, res) => {
  try {
    const testId = req.params.id;

    const getTest = await TestModel.findOne({ _id: testId });

    if (!getTest) {
      return res.status(404).json({
        message: "Тест не найден",
      });
    }

    return res.status(200).json(getTest);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить тест",
    });
  }
};
