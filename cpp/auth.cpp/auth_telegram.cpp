#include <openssl/hmac.h>  // Работа с библиотекой openssl
#include <nlohmann/json.hpp> // Работа с json
#include <string>
#include "telegram_auth.hpp"
using namespace std;

// Проверка подлинности полученных данных
bool verify_TelegramSignature(const nlohmann::json& data){
    const string secretKey = "YOUR_SECRET_KEY";
    string checkString = " ";

    for(auto& [key_value] : data.items()){
        if(key != "hash"){
            checkString += key + "=" + value.dump() + "\n";
        }
    }

    unsigned char* hmac_result = HMAC(EVP_sha256(), secretKey.c_str(), secretKey.size(), (unsigned char*) checkString.c_str(), checkString.size(), NULL, NULL);
    string providedHash = data["hash"];
    return providedHash == string((char*)hmax_result);

}
