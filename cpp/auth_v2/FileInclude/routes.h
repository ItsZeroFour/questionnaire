#ifndef ROUTES_H
#define ROUTES_H

#include <pistache/router.h>
#include "oauth.h"
#include "db.h"
#include "token.h"

class Routes {
public:
    explicit Routes(OAuth& oauth, Database& db, TokenManager& tokenManager);

    void setupRoutes(Pistache::Rest::Router& router);

private:
    void loginHandler(const Pistache::Rest::Request& request, Pistache::Http::ResponseWriter response);
    void validateHandler(const Pistache::Rest::Request& request, Pistache::Http::ResponseWriter response);

    OAuth& oauthClient;
    Database& database;
    TokenManager& tokenManager;
};

#endif // ROUTES_H
