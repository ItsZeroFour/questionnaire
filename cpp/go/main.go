package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
)

// Структура для парсинга WebAppData
type WebAppData struct {
	QueryID string `json:"query_id"`
	UserID  string `json:"user_id"`
	Data    string `json:"data"`
}

// Основной обработчик запросов
func main() {
	http.HandleFunc("/webapp", webAppHandler)

	// Получение порта из переменных окружения
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Сервер запущен на порту %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

// Обработчик для взаимодействия с Telegram WebApp
func webAppHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Проверяем метод запроса
	if r.Method != http.MethodPost {
		http.Error(w, "Метод не поддерживается", http.StatusMethodNotAllowed)
		return
	}

	// Проверяем наличие токена авторизации
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Необходим заголовок Authorization", http.StatusUnauthorized)
		return
	}

	// Извлечение токена из заголовка
	token := strings.TrimPrefix(authHeader, "Bearer ")
	if !validateTelegramToken(token) {
		http.Error(w, "Неверный токен авторизации", http.StatusUnauthorized)
		return
	}

	// Декодируем входящие данные
	var data WebAppData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, "Невалидные данные", http.StatusBadRequest)
		return
	}

	// Логика обработки данных от Telegram Mini App
	fmt.Printf("Получен запрос от UserID: %s, Data: %s\n", data.UserID, data.Data)

	// Возвращаем ответ
	response := map[string]string{
		"status":  "success",
		"message": "Данные успешно обработаны",
	}
	json.NewEncoder(w).Encode(response)
}

// Валидация токена (заглушка, здесь должна быть логика проверки через Telegram API)
func validateTelegramToken(token string) bool {
	// В идеале нужно расшифровать токен через секретный ключ бота и проверить его подпись
	return len(token) > 10 // Простейшая проверка для примера
}
