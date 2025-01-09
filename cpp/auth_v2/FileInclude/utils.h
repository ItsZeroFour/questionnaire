#ifndef UTILS_H
#define UTILS_H

#include <string>
#include <map>

namespace Utils {
    std::string base64Encode(const std::string& input);
    std::string base64Decode(const std::string& input);
    std::map<std::string, std::string> parseQueryString(const std::string& query);
}

#endif // UTILS_H
