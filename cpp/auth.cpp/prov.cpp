#include <jwt-cpp/jwt.h>
#include <iostream>

bool validate_jwt(const std::string& token, const std::string& secret_key) {
    try {
        // Разбираем и проверяем токен
        auto decoded = jwt::decode(token);

        // Проверяем подпись
        auto verifier = jwt::verify()
                            .allow_algorithm(jwt::algorithm::hs256{secret_key}) // Указываем алгоритм и ключ
                            .with_issuer("auth_service"); // (Опционально) проверка поля "issuer"
        
        verifier.verify(decoded); // Выполняем валидацию

        // Проверяем срок действия
        auto exp = decoded.get_expires_at();
        if (exp < std::chrono::system_clock::now()) {
            std::cerr << "Token has expired!" << std::endl;
            return false;
        }

        // Выводим полезную нагрузку токена
        std::cout << "Payload: " << std::endl;
        for (const auto& claim : decoded.get_payload_claims()) {
            std::cout << " " << claim.first << ": " << claim.second.to_json() << std::endl;
        }

        return true;
    } catch (const std::exception& e) {
        std::cerr << "Invalid token: " << e.what() << std::endl;
        return false;
    }
}

int main() {
    std::string secret_key = "your_secret_key";
    std::string token = "YOUR_GENERATED_JWT_HERE";

    if (validate_jwt(token, secret_key)) {
        std::cout << "Token is valid!" << std::endl;
    } else {
        std::cout << "Token is invalid!" << std::endl;
    }

    return 0;
}
