#ifndef TOKEN_H
#define TOKEN_H

#include <string>
#include <jwt-cpp/jwt.h>

class TokenManager {
public:
    explicit TokenManager(const std::string& secret);

    std::string generateToken(const std::string& userId);
    bool validateToken(const std::string& token);

private:
    std::string secretKey;
};

#endif // TOKEN_H
