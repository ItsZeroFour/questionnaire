package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	tb "gopkg.in/telebot.v3"
)

type Poll struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"` // Добавим поле ID
	UserID    int64              `bson:"user_id"`
	Title     string             `bson:"title"`
	Questions []Question         `bson:"questions"`
	CreatedAt time.Time          `bson:"created_at"`
}

type Question struct {
	QuestionText string   `bson:"questionText"`
	Options      []string `bson:"options"`
}

var activePolls = make(map[int64]*Poll)
var pollsCollection *mongo.Collection

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	apiToken := os.Getenv("TELEGRAM_API_TOKEN")
	mongoURI := os.Getenv("MONGO_URI")

	// Подключил к MongoDB
	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.TODO())

	pollsCollection = client.Database("test").Collection("tests")

	// Начало работы бота
	botSettings := tb.Settings{
		Token:  apiToken,
		Poller: &tb.LongPoller{Timeout: 10 * time.Second},
	}
	bot, err := tb.NewBot(botSettings)
	if err != nil {
		log.Fatal(err)
	}

	startKeyboard := &tb.ReplyMarkup{ResizeKeyboard: true}
	btnCreatePoll := startKeyboard.Text("➕ Создать опрос")
	btnTakePoll := startKeyboard.Text("📊 Пройти опрос")
	startKeyboard.Reply(
		startKeyboard.Row(btnCreatePoll, btnTakePoll),
	)

	finishKeyboard := &tb.ReplyMarkup{ResizeKeyboard: true}
	btnFinishPoll := finishKeyboard.Text("✅ Завершить создание опроса")
	finishKeyboard.Reply(
		finishKeyboard.Row(btnFinishPoll),
	)

	// Сообщения
	bot.Handle("/start", func(c tb.Context) error {
		return c.Send("Добро пожаловать в бота для проведения массовых опросов!\nВыберите действие ниже:", startKeyboard)
	})

	bot.Handle(&btnCreatePoll, func(c tb.Context) error {
		userID := c.Sender().ID
		activePolls[userID] = &Poll{
			UserID:    userID,
			Questions: []Question{},
		}
		return c.Send("Введите название (title) для нового опроса:")
	})

	bot.Handle(tb.OnText, func(c tb.Context) error {
		userID := c.Sender().ID
		activePoll, exists := activePolls[userID]
		if !exists {
			return nil
		}

		text := c.Text()
		switch activePoll.Title {
		case "":
			activePoll.Title = text
			return c.Send(fmt.Sprintf("Название опроса установлено: %s\nТеперь введите вопрос для опроса:", text), finishKeyboard)
		default:
			if len(activePoll.Questions) > 0 && len(activePoll.Questions[len(activePoll.Questions)-1].Options) == 0 {
				options := strings.Split(text, ",")
				for i := range options {
					options[i] = strings.TrimSpace(options[i])
				}
				activePoll.Questions[len(activePoll.Questions)-1].Options = options
				return c.Send(fmt.Sprintf("Варианты добавлены: %s\nВведите следующий вопрос или завершите создание опроса.", strings.Join(options, ", ")), finishKeyboard)
			} else {
				activePoll.Questions = append(activePoll.Questions, Question{QuestionText: text})
				return c.Send(fmt.Sprintf("Вопрос добавлен: %s\nТеперь введите варианты ответа через запятую:", text))
			}
		}
	})

	bot.Handle(&btnFinishPoll, func(c tb.Context) error {
		userID := c.Sender().ID
		activePoll, exists := activePolls[userID]
		if !exists || len(activePoll.Questions) == 0 {
			return c.Send("Вы ещё не добавили ни одного вопроса!")
		}

		// Сохранение опроса в БД
		activePoll.CreatedAt = time.Now()
		_, err := pollsCollection.InsertOne(context.TODO(), activePoll)
		if err != nil {
			log.Println("Error saving poll:", err)
			return c.Send("Произошла ошибка при сохранении опроса.")
		}

		delete(activePolls, userID)

		summary := fmt.Sprintf("Опрос завершен и сохранен в базе данных!\nНазвание: %s\n", activePoll.Title)
		for i, q := range activePoll.Questions {
			summary += fmt.Sprintf("%d. %s\nВарианты: %s\n", i+1, q.QuestionText, strings.Join(q.Options, ", "))
		}
		return c.Send(summary, startKeyboard)
	})

	bot.Handle(&btnTakePoll, func(c tb.Context) error {
		cursor, err := pollsCollection.Find(context.TODO(), bson.M{})
		if err != nil {
			return c.Send("Ошибка при получении опросов.")
		}
		for cursor.Next(context.TODO()) {
			var poll Poll
			if err := cursor.Decode(&poll); err != nil {
				continue
			}
			// Логика обработки данных
		}
		cursor.Close(context.TODO()) // Закрытие после использования

	
		inlineKeyboard := &tb.ReplyMarkup{}
		for cursor.Next(context.TODO()) {
			var poll Poll
			if err := cursor.Decode(&poll); err != nil { continue }
			btn := inlineKeyboard.Data(poll.Title, fmt.Sprintf("poll_%s", poll.ID.Hex()))
			
			// Добавлен обработчик кнопок
			bot.Handle(&btn, func(ctx tb.Context) error {
				return ctx.Send(fmt.Sprintf("Вы выбрали опрос: %s", poll.Title))
			})
	
			inlineKeyboard.Inline(inlineKeyboard.Row(btn))
		}
	
		return c.Send("Выберите опрос для участия:", inlineKeyboard)
	})

	bot.Start()
}
