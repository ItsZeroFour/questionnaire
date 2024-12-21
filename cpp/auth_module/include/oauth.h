#ifndef OAUTH_H
#define OAUTH_H

#include <string>

class OAuth {
public:
    OAuth(const std::string& clientId, const std::string& clientSecret, const std::string& redirectUri);

    std::string exchangeCodeForToken(const std::string& code);
    std::string getUserId(const std::string& accessToken);

private:
    std::string clientId;
    std::string clientSecret;
    std::string redirectUri;

    std::string sendHttpRequest(const std::string& url, const std::string& data);
};

#endif // OAUTH_H
