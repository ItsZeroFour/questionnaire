#ifndef DB_H
#define DB_H

#include <mongocxx/client.hpp>
#include <mongocxx/instance.hpp>
#include <string>

class Database {
public:
    Database(const std::string& uri, const std::string& dbName);

    bool saveUserToken(const std::string& userId, const std::string& token);
    bool validateUserToken(const std::string& token);

private:
    mongocxx::instance instance;
    mongocxx::client client;
    mongocxx::database database;
};

#endif // DB_H
