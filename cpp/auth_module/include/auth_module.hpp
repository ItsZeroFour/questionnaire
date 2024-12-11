#ifndef AUTH_MODULE_HPP
#define AUTH_MODULE_HPP

#include <string>

namespace AuthModule {
    bool loginUser(const std::string& userId, const std::string& token);
    bool validateToken(const std::string& token);
}

#endif