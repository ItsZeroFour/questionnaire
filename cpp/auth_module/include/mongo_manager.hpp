#ifndef MONGO_MANAGER_HPP
#define MONGO_MANAGER_HPP

#include <mongocxx/client.hpp>
#include <mongocxx/instance.hpp>
#include <mongocxx/uri.hpp>
#include <string>
#include <vector>

class MongoManager {
public:
    MongoManager(const std::string& uri);

    bool insertDocument(const std::string& collectionName, const bsoncxx::document::view_or_value& document);
    std::vector<bsoncxx::document::value> findDocuments(const std::string& collectionName, const bsoncxx::document::view_or_value& filter);

private:
    mongocxx::client client_;
    mongocxx::database db_;
};

#endif // MONGO_MANAGER_HPP
