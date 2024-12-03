#include <jwt-cpp/jwt.h>
#include <iostream>

std::string generate_jwt(const std::string& user_id, const std::string& secret_key) {
    // Создаем JWT токен
    auto token = jwt::create()
                     .set_type("JWT") // Тип токена
                     .set_algorithm("HS256") // Алгоритм подписи
                     .set_issued_at(std::chrono::system_clock::now()) // Время создания токена
                     .set_expires_at(std::chrono::system_clock::now() + std::chrono::minutes(60)) // Время истечения
                     .set_payload_claim("user_id", jwt::claim(user_id)) // Добавляем данные
                     .sign(jwt::algorithm::hs256{secret_key}); // Подписываем токен

    return token;
}

int main() {
    std::string secret_key = "your_secret_key";
    std::string user_id = "12345"; // Идентификатор пользователя

    std::string token = generate_jwt(user_id, secret_key);
    std::cout << "Generated JWT: " << token << std::endl;

    return 0;
}
