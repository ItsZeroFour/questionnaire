#ifndef JSON_LOADER_HPP
#define JSON_LOADER_HPP

#include <string>
#include <nlohmann/json.hpp>

class JsonLoader {
public:
    static nlohmann::json loadFromFile(const std::string& filePath);
};

#endif // JSON_LOADER_HPP
