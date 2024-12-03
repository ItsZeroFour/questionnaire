#include <iostream>
#include <string>

// Пример функции обработки запроса
void handle_request(const std::string& token, const std::string& secret_key) {
    if (validate_jwt(token, secret_key)) {
        std::cout << "Request authorized!" << std::endl;
    } else {
        std::cout << "Unauthorized request." << std::endl;
    }
}

int main() {
    std::string secret_key = "your_secret_key";
    std::string incoming_token = "YOUR_INCOMING_JWT";

    handle_request(incoming_token, secret_key);

    return 0;
}
