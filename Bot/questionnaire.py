import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from aiogram.filters import Command
from pymongo import MongoClient
import datetime
import logging
from dotenv import load_dotenv
import os

# Загружаем переменные из .env
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


API_TOKEN = os.getenv("TELEGRAM_API_TOKEN")
MONGO_URI = os.getenv("MONGO_URI")


client = MongoClient(MONGO_URI)
db = client['Groupproject']
polls_collection = db['polls']


bot = Bot(token=API_TOKEN)
dp = Dispatcher()


active_poll = {}

start_keyboard = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="📊 Пройти опрос")],
        [KeyboardButton(text="➕ Создать опрос")]
    ],
    resize_keyboard=True
)

finish_keyboard = ReplyKeyboardMarkup(
    keyboard=[[KeyboardButton(text="✅ Завершить создание опроса")]],
    resize_keyboard=True
)


@dp.message(Command(commands=["start"]))
async def start_command(message: types.Message):
    await message.answer(
        "Добро пожаловать в бота для проведения массовых опросов!\nВыберите действие ниже:",
        reply_markup=start_keyboard
    )


@dp.message(lambda message: message.text == "➕ Создать опрос")
async def create_poll_start(message: types.Message):
    active_poll[message.from_user.id] = {"questions": [], "state": "waiting_for_question"}
    await message.answer("Введите вопрос для создания опроса:", reply_markup=finish_keyboard)


@dp.message(lambda message: message.from_user.id in active_poll and active_poll[message.from_user.id]["state"] == "waiting_for_question")
async def add_poll_question(message: types.Message):
    if message.text == "✅ Завершить создание опроса":
        await finish_poll_creation(message)
        return

    active_poll[message.from_user.id]["questions"].append({"question": message.text, "options": []})
    active_poll[message.from_user.id]["state"] = "waiting_for_options"
    await message.answer(f"Вопрос добавлен: {message.text}\nТеперь введите варианты ответа через запятую:")


@dp.message(lambda message: message.from_user.id in active_poll and active_poll[message.from_user.id]["state"] == "waiting_for_options")
async def add_poll_options(message: types.Message):
    if message.text == "✅ Завершить создание опроса":
        await finish_poll_creation(message)
        return

    options = [opt.strip() for opt in message.text.split(",")]
    active_poll[message.from_user.id]["questions"][-1]["options"] = options
    active_poll[message.from_user.id]["state"] = "waiting_for_question"
    await message.answer(f"Варианты добавлены: {', '.join(options)}\nВведите следующий вопрос или завершите создание опроса.")


async def save_poll_to_db(user_id, questions):
    poll_data = {
        "user_id": user_id,
        "questions": questions,
        "created_at": datetime.datetime.now()
    }
    result = polls_collection.insert_one(poll_data)
    return result.inserted_id


async def finish_poll_creation(message: types.Message):
    user_id = message.from_user.id
    if user_id not in active_poll or not active_poll[user_id]["questions"]:
        await message.answer("Вы ещё не добавили ни одного вопроса!", reply_markup=start_keyboard)
        return

    try:
        
        poll_id = await save_poll_to_db(user_id, active_poll[user_id]["questions"])
        
        
        poll_summary = "\n".join(
            f"{i}. {question['question']}\nВарианты: {', '.join(question['options'])}"
            for i, question in enumerate(active_poll[user_id]["questions"], 1)
        )
        
        
        await message.answer(f"Опрос завершен и сохранен в базе данных! ID опроса: {poll_id}\nВот ваш опрос:\n{poll_summary}")
    except Exception as e:
        logger.error(f"Ошибка при сохранении опроса: {e}")
        await message.answer("Произошла ошибка при сохранении опроса. Попробуйте снова.")
    finally:
        
        del active_poll[user_id]
        await message.answer("Вы вышли из режима создания опроса.", reply_markup=start_keyboard)

@dp.message(lambda message: message.text == "📊 Пройти опрос")
async def send_polls(message: types.Message):
    data = polls_collection.find()  # Получаем данные
    if polls_collection.count_documents({}) == 0:
        await message.reply("В базе нет вопросов!")
        return

    for item in data:  
        questions = item.get("questions", [])
        for question_data in questions:
            question = question_data.get("question", "Вопрос отсутствует")
            options = question_data.get("options", [])  # Исправлено

            if options:
                await bot.send_poll(
                    chat_id=message.chat.id,
                    question=question,  
                    options=options,  
                    is_anonymous=False
                )
            else:
                await message.reply(f"Опрос \"{question}\" не имеет вариантов ответа.")



async def main():
    await bot.delete_webhook(drop_pending_updates=True)
    logger.info("Бот запущен!")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())