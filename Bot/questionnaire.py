import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from aiogram.filters import Command

API_TOKEN = "7221571794:AAHavgln73Hx4OfrCLwbAvczkptlTMpJVLI"  


bot = Bot(token=API_TOKEN)
dp = Dispatcher()


active_poll = {}


@dp.message(Command(commands=["start"]))
async def start_command(message: types.Message):
    
    markup = ReplyKeyboardMarkup(keyboard=[[KeyboardButton(text="📊 Пройти опрос")],
                                            [KeyboardButton(text="➕ Создать опрос")]],
                                 resize_keyboard=True)
    await message.answer(
        "Добро пожаловать в бота для проведения розыгрышей!\nВыберите действие ниже:",
        reply_markup=markup
    )


@dp.message(lambda message: message.text == "➕ Создать опрос")
async def create_poll_start(message: types.Message):
    
    active_poll[message.from_user.id] = {"questions": [], "state": "waiting_for_question"}
    await message.answer("Введите вопрос для создания опроса: ")


@dp.message(lambda message: message.from_user.id in active_poll and active_poll[message.from_user.id]["state"] == "waiting_for_question")
async def add_poll_question(message: types.Message):
    #
    active_poll[message.from_user.id]["questions"].append({"question": message.text, "options": []})
    
    active_poll[message.from_user.id]["state"] = "waiting_for_options"
    await message.answer(f"Вопрос добавлен: {message.text}\nТеперь введите варианты ответа через запятую:")


@dp.message(lambda message: message.from_user.id in active_poll and active_poll[message.from_user.id]["state"] == "waiting_for_options")
async def add_poll_options(message: types.Message):

    options = message.text.split(",")
    
    active_poll[message.from_user.id]["questions"][-1]["options"] = options
    
    active_poll[message.from_user.id]["state"] = "waiting_for_question"
    await message.answer(f"Варианты добавлены: {', '.join(options)}\nВведите следующий вопрос или завершите создание опроса. Напишите /finish, чтобы завершить создание опроса.")


@dp.message(Command(commands=["finish"]))
async def finish_poll_creation(message: types.Message):
    if message.from_user.id not in active_poll or not active_poll[message.from_user.id]["questions"]:
        await message.answer("Вы ещё не добавили ни одного вопроса!")
        return
   
    await message.answer("Опрос завершен! Вот ваш опрос:\n")
    for i, question in enumerate(active_poll[message.from_user.id]["questions"], 1):
        await message.answer(f"{i}. {question['question']}\nВарианты: {', '.join(question['options'])}")
    
    del active_poll[message.from_user.id]

async def main():
    
    await bot.delete_webhook(drop_pending_updates=True)

   
    print("Бот запущен!")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())

