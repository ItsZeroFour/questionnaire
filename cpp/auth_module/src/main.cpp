#include <pistache/endpoint.h>
#include "routes.h"

using namespace Pistache;

int main() {
    // Настройка адреса сервера
    Address addr(Ipv4::any(), Port(8080));
    Http::Endpoint server(addr);

    // Инициализация
    auto opts = Http::Endpoint::options().threads(2);
    server.init(opts);

    // Настройка маршрутов
    Rest::Router router;
    setupRoutes(router);
    server.setHandler(router.handler());

    // Запуск сервера
    server.serve();
    return 0;
}
