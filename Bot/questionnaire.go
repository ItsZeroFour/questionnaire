package main

import (
	"context"
	"log"
	"os"
	"strings"
	"time"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	bot             *tgbotapi.BotAPI
	mongoClient     *mongo.Client
	pollsCollection *mongo.Collection
	activePolls     = make(map[int64]map[string]interface{}) // Хранение активных опросов
)

func main() {
	// Загрузка переменных окружения
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Ошибка загрузки .env файла: %v", err)
	}

	apiToken := os.Getenv("TELEGRAM_API_TOKEN")
	mongoURI := os.Getenv("MONGO_URI")

	// Подключение к MongoDB
	mongoClient, err = mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatalf("Ошибка подключения к MongoDB: %v", err)
	}
	defer mongoClient.Disconnect(context.TODO())

	// Подключение к коллекции
	db := mongoClient.Database("Groupproject")
	pollsCollection = db.Collection("polls")

	// Инициализация бота
	bot, err = tgbotapi.NewBotAPI(apiToken)
	if err != nil {
		log.Fatalf("Ошибка инициализации бота: %v", err)
	}

	bot.Debug = true
	log.Printf("Бот авторизован как %s", bot.Self.UserName)

	updates := bot.GetUpdatesChan(tgbotapi.NewUpdate(0))

	for update := range updates {
		if update.Message != nil {
			handleMessage(update.Message)
		}
	}
}

func handleMessage(message *tgbotapi.Message) {
	if message.IsCommand() {
		switch message.Command() {
		case "start":
			startCommand(message)
		}
	} else if poll, exists := activePolls[message.Chat.ID]; exists {
		if poll["state"] == "waiting_for_question" {
			addPollQuestion(message)
		} else if poll["state"] == "waiting_for_options" {
			addPollOptions(message)
		}
	} else if message.Text == "📊 Пройти опрос" {
		sendPolls(message)
	} else if message.Text == "➕ Создать опрос" {
		createPoll(message)
	}
}

func startCommand(message *tgbotapi.Message) {
	startKeyboard := tgbotapi.NewReplyKeyboard(
		tgbotapi.NewKeyboardButtonRow(
			tgbotapi.NewKeyboardButton("📊 Пройти опрос"),
			tgbotapi.NewKeyboardButton("➕ Создать опрос"),
		),
	)
	msg := tgbotapi.NewMessage(message.Chat.ID, "Добро пожаловать! Выберите действие:")
	msg.ReplyMarkup = startKeyboard
	bot.Send(msg)
}

func createPoll(message *tgbotapi.Message) {
	activePolls[message.Chat.ID] = map[string]interface{}{
		"questions": []map[string]interface{}{},
		"state":     "waiting_for_question",
	}
	msg := tgbotapi.NewMessage(message.Chat.ID, "Введите вопрос для создания опроса:")

	// Создание кнопки для завершения опроса
	keyboard := tgbotapi.NewInlineKeyboardMarkup(
		[]tgbotapi.InlineKeyboardButton{
			tgbotapi.NewInlineKeyboardButtonData("✅ Завершить создание опроса", "finish_poll"),
		},
	)
	msg.ReplyMarkup = keyboard

	bot.Send(msg)
}

func addPollQuestion(message *tgbotapi.Message) {
	if message.Text == "✅ Завершить создание опроса" {
		finishPoll(message)
		return
	}

	poll := activePolls[message.Chat.ID]
	questions := poll["questions"].([]map[string]interface{})
	questions = append(questions, map[string]interface{}{
		"question": message.Text,
		"options":  []string{},
	})
	activePolls[message.Chat.ID]["questions"] = questions
	activePolls[message.Chat.ID]["state"] = "waiting_for_options"
	msg := tgbotapi.NewMessage(message.Chat.ID, "Введите варианты ответа через запятую:")
	bot.Send(msg)
}

func addPollOptions(message *tgbotapi.Message) {
	if message.Text == "✅ Завершить создание опроса" {
		finishPoll(message)
		return
	}

	poll := activePolls[message.Chat.ID]
	questions := poll["questions"].([]map[string]interface{})
	options := strings.Split(message.Text, ",")
	for i := range options {
		options[i] = strings.TrimSpace(options[i])
	}
	questions[len(questions)-1]["options"] = options
	activePolls[message.Chat.ID]["state"] = "waiting_for_question"
	msg := tgbotapi.NewMessage(message.Chat.ID, "Вопрос добавлен. Введите следующий вопрос или завершите создание опроса.")
	bot.Send(msg)
}

func finishPoll(message *tgbotapi.Message) {
	poll := activePolls[message.Chat.ID]
	delete(activePolls, message.Chat.ID)

	// Сохранение опроса в базу данных
	_, err := pollsCollection.InsertOne(context.TODO(), bson.M{
		"user_id":    message.Chat.ID,
		"questions":  poll["questions"],
		"created_at": time.Now(),
	})
	if err != nil {
		msg := tgbotapi.NewMessage(message.Chat.ID, "Ошибка сохранения опроса.")
		bot.Send(msg)
		return
	}

	msg := tgbotapi.NewMessage(message.Chat.ID, "Опрос успешно сохранен.")
	bot.Send(msg)
}

func sendPolls(message *tgbotapi.Message) {
	cursor, err := pollsCollection.Find(context.TODO(), bson.M{})
	if err != nil {
		log.Printf("Ошибка получения опросов: %v", err)
		msg := tgbotapi.NewMessage(message.Chat.ID, "Ошибка получения опросов.")
		bot.Send(msg)
		return
	}
	defer cursor.Close(context.TODO())

	for cursor.Next(context.TODO()) {
		var poll bson.M
		if err := cursor.Decode(&poll); err != nil {
			log.Printf("Ошибка декодирования опроса: %v", err)
			continue
		}

		questions := poll["questions"].([]interface{})
		for _, q := range questions {
			question := q.(bson.M)
			text := question["question"].(string)
			options := question["options"].([]interface{})

			optionsText := []string{}
			for _, opt := range options {
				optionsText = append(optionsText, opt.(string))
			}

			pollMsg := tgbotapi.NewPoll(message.Chat.ID, text, optionsText...)
			pollMsg.IsAnonymous = false
			bot.Send(pollMsg)
		}
	}
}
