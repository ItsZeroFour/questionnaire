#include "mongo_manager.hpp"
#include <iostream>

MongoManager::MongoManager(const std::string& uri)
    : client_(mongocxx::uri{uri}), db_(client_["test_app"]) {
    std::cout << "Connected to MongoDB at " << uri << std::endl;
}

bool MongoManager::insertDocument(const std::string& collectionName, const bsoncxx::document::view_or_value& document) {
    try {
        auto collection = db_[collectionName];
        collection.insert_one(document);
        return true;
    } catch (const std::exception& e) {
        std::cerr << "Error inserting document: " << e.what() << std::endl;
        return false;
    }
}

std::vector<bsoncxx::document::value> MongoManager::findDocuments(const std::string& collectionName, const bsoncxx::document::view_or_value& filter) {
    std::vector<bsoncxx::document::value> results;
    try {
        auto collection = db_[collectionName];
        auto cursor = collection.find(filter);
        for (auto&& doc : cursor) {
            results.push_back(bsoncxx::document::value(doc));
        }
    } catch (const std::exception& e) {
        std::cerr << "Error finding documents: " << e.what() << std::endl;
    }
    return results;
}
