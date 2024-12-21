#include "db.h"
#include <mongocxx/client.hpp>
#include <mongocxx/instance.hpp>

bool saveUserToDB(const json& userInfo, const std::string& token) {
    try {
        mongocxx::instance instance{};
        mongocxx::client client{mongocxx::uri{}};
        auto db = client["auth_db"];
        auto users = db["users"];

        bsoncxx::builder::stream::document document{};
        document << "id" << userInfo["id"]
                 << "username" << userInfo["username"]
                 << "access_token" << token;

        users.insert_one(document.view());
        return true;
    } catch (const std::exception& e) {
        return false;
    }
}
