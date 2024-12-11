// Реализация менеджера прав 
#include "permission_manager.hpp"
#include <iostream>
#include <unordered_map>

using namespace std;
namespace Permissions{
    unordered_map < string, unordered_map < string, bool >> permissionMap;
    bool hadPermission(const string& userId, const string& action){
        return permissionMap[userId][action];
    }
    void grandPermissions(const string& userId, const string& action){
        permissionMap[userId][action] = true;
        cout << "Granted" << action << "to" << userId << "\n";
    }

    void revokePermissin(const string& userId, const string& action){
        permissionMap[userId][action] = false;
        cout << "Revoke" << action << "from" << userId << "\n";
    }
}
