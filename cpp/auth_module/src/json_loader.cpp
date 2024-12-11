#include "json_loader.hpp"
#include <fstream>
#include <iostream>
#include <stdexcept>

nlohmann::json JsonLoader::loadFromFile(const std::string& filePath) {
    std::ifstream file(filePath);
    if (!file.is_open()) {
        throw std::runtime_error("Failed to open JSON file: " + filePath);
    }

    nlohmann::json jsonData;
    file >> jsonData;
    return jsonData;
}
