#include "auth_module.hpp"
#include "permission_manager.hpp"
#include "mongo_manager.hpp"
#include <bsoncxx/json.hpp>
#include <iostream>
#include <stdexcept> // Добавлен для invalid_argument
#include <mongocxx/exception/logic_error.hpp> //для обработки исключений mongo
#include <auth_module.hpp>
#include "nlohman/json.hpp"

using namespace std;

int main(){
    AuthModule auth;

    nlohman::json telegramData = {
        {"id", " "},
        {"user_name", " "},
        {"auth_date", " "},
        {"hash", "sample_hash"}
    };

    if(auth.authenticateTelegram(telegramData)){
        cout << "Аунтентификация выполнена успешна!" << endl;

    } elsse {
        cout << "Ошибка аунтентификации!" << endl;
    }

    // РАботаем с правами(пример реализации)
    auth.grandPermission("123577", "view_dashboard");
    if(auth.hasPermission("1234578", "view_dashboard")){
        cout << "Пользователь получил доступ";

    }
    return 0;
}
