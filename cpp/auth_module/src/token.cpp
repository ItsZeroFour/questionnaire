#include "token.h"
#include <openssl/hmac.h>
#include <openssl/sha.h>
#include <ctime>

std::string generateToken(const std::string& userId, const std::string& username) {
    std::string payload = userId + ":" + username + ":" + std::to_string(std::time(nullptr));
    unsigned char hash[SHA256_DIGEST_LENGTH];
    HMAC(EVP_sha256(), "secret_key", strlen("secret_key"), (unsigned char*)payload.c_str(), payload.length(), hash, nullptr);

    std::string token(hash, hash + SHA256_DIGEST_LENGTH);
    return token;
}

bool validateAccessToken(const std::string& token) {
    // Пример простой проверки (добавить проверку в базе данных)
    return !token.empty();
}
