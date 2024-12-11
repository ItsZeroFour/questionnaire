#ifndef PERMISSION_MANAGER_HPP
#define PERMISSION_MANAGER_HPP

#include <string>
#include <unordered_map>

namespace Permissions {
    bool hasPermission(const std::string& userId, const std::string& action);
    void grantPermission(const std::string& userId, const std::string& action);
    void revokePermission(const std::string& userId, const std::string& action);
}

#endif // PERMISSION_MANAGER_HPP
