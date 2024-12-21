#include "oauth.h"
#include <curl/curl.h>

json getUserInfoFromOAuth(const std::string& code) {
    // Пример для Yandex OAuth2
    std::string url = "https://oauth.yandex.ru/token/info";
    std::string postData = "code=" + code + "&client_id=your_client_id&client_secret=your_secret";

    // Запрос через cURL
    CURL* curl = curl_easy_init();
    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, postData.c_str());

    std::string responseStr;
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, [](void* contents, size_t size, size_t nmemb, std::string* userData) -> size_t {
        userData->append((char*)contents, size * nmemb);
        return size * nmemb;
    });
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &responseStr);

    CURLcode res = curl_easy_perform(curl);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK) {
        return {};
    }

    return json::parse(responseStr);
}
