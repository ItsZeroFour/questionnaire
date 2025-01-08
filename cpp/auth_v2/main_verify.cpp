#include <iostream>
#include <string>
#include <bcrypt.h>
#include <mongo/client/dbclient.h>
#include <curl/curl.h>
#include <jwt-cpp/jwt.h>
#include <random>
#include <ctime>

// Подключение к MongoDB
#define MONGO_DB_URI "mongodb+srv://questionnaire:%3Cdsf32wdfhsuhR7fdw%3E@cluster0.zjqrx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
 // юри нашей 

// Константы для SMTP
#define SMTP_SERVER "smtp.yandex.com" // Замените на SMTP сервер
#define SMTP_PORT 587
#define SMTP_EMAIL "your_email@yandex.com" // Замените на ваш email
#define SMTP_PASSWORD "your_password" // Замените на ваш пароль

// Функция для генерации уникального кода верификации
std::string generateVerificationCode() {
    std::string code;
    std::string characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    std::mt19937 rng(time(0));
    std::uniform_int_distribution<int> dist(0, characters.size() - 1);

    for (int i = 0; i < 6; ++i) {
        code += characters[dist(rng)];
    }
    return code;
}

// Хеширование пароля с использованием bcrypt
std::string hashPassword(const std::string& password) {
    const char* salt = bcrypt_gensalt(12);  // Генерация соли для bcrypt
    char hashedPassword[256];
    bcrypt_hashpw(password.c_str(), salt, hashedPassword);
    return std::string(hashedPassword);
}

// Функция для отправки email через SMTP
void sendVerificationEmail(const std::string& email, const std::string& code) {
    CURL* curl;
    CURLcode res;

    curl_global_init(CURL_GLOBAL_DEFAULT);
    curl = curl_easy_init();
    
    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, "smtp://smtp.yandex.com");  // Замените на ваш SMTP сервер
        curl_easy_setopt(curl, CURLOPT_MAIL_FROM, "your_email@yandex.com"); // Замените на ваш email
        curl_easy_setopt(curl, CURLOPT_USERNAME, "your_email@yandex.com"); // Замените на ваш email
        curl_easy_setopt(curl, CURLOPT_PASSWORD, "your_password"); // Замените на ваш пароль
        curl_easy_setopt(curl, CURLOPT_PORT, SMTP_PORT);
        
        struct curl_slist* recipients = NULL;
        recipients = curl_slist_append(recipients, email.c_str());
        curl_easy_setopt(curl, CURLOPT_MAIL_RCPT, recipients);
        
        std::string emailBody = "Ваш код подтверждения: " + code;
        
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, emailBody.c_str());

        res = curl_easy_perform(curl);

        if(res != CURLE_OK) {
            std::cerr << "Ошибка при отправке письма: " << curl_easy_strerror(res) << std::endl;
        } else {
            std::cout << "Письмо успешно отправлено!" << std::endl;
        }

        curl_easy_cleanup(curl);
    }

    curl_global_cleanup();
}

// Регистрация пользователя
void registerUser(const std::string& firstName, const std::string& lastName, const std::string& email, const std::string& password, const std::string& discipline) {
    try {
        mongo::DBClientConnection conn;
        conn.connect(MONGO_DB_URI);  // Подключение к базе данных MongoDB

        // Проверка на существование пользователя с таким email
        mongo::BSONObj query = BSON("email" << email);
        if (conn.count("users", query) > 0) {
            std::cerr << "Пользователь с таким email уже существует!" << std::endl;
            return;
        }

        // Хеширование пароля
        std::string hashedPassword = hashPassword(password);
