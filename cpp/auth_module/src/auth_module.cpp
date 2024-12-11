#include "auth_module.hpp"
#include <iostream>

using namespace std;
namespace AuthMOdule{
    bool loginUser(const string& userId, const string& token){
        cout << "User" << "userId" << "logget in with token: " << token << "\n"; // Запрос при авторизаци
        return true;
    }
// Проверка токена( в нашем случае JWT)
    bool valideteToken(const string& token){
        cout << "Validating token: " << token << "\n";
        return true;
    }
}
