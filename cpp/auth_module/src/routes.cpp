#include "routes.h"
#include "oauth.h"
#include "token.h"
#include "db.h"

void setupRoutes(Rest::Router& router) {
    using namespace Rest;

    // Маршрут для аутентификации
    Routes::Post(router, "/login", Routes::bind(handleLogin));
    // Маршрут для валидации токена
    Routes::Post(router, "/validate", Routes::bind(validateToken));
}

void handleLogin(const Rest::Request& request, Http::ResponseWriter response) {
    auto body = request.body();
    auto userData = json::parse(body);

    std::string code = userData["code"]; // OAuth код

    // Получение данных пользователя из OAuth2
    auto userInfo = getUserInfoFromOAuth(code);
    if (userInfo.empty()) {
        response.send(Http::Code::Unauthorized, "OAuth failed");
        return;
    }

    // Генерация токена
    auto token = generateToken(userInfo["id"], userInfo["username"]);
    
    // Сохранение данных в MongoDB
    if (!saveUserToDB(userInfo, token)) {
        response.send(Http::Code::Internal_Server_Error, "DB error");
        return;
    }

    // Ответ клиенту
    json result = {{"access_token", token}};
    response.send(Http::Code::Ok, result.dump());
}

void validateToken(const Rest::Request& request, Http::ResponseWriter response) {
    auto body = request.body();
    auto data = json::parse(body);

    std::string token = data["access_token"];
    
    if (validateAccessToken(token)) {
        response.send(Http::Code::Ok, "Token is valid");
    } else {
        response.send(Http::Code::Unauthorized, "Invalid token");
    }
}
