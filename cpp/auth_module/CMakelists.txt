cmake_minimum_required(VERSION 3.10)
project(auth_module)

set(CMAKE_CXX_STANDARD 17)

find_package(Pistache REQUIRED)
find_package(Mongocxx REQUIRED)
find_package(OpenSSL REQUIRED)

add_executable(auth_module src/main.cpp src/routes.cpp src/oauth.cpp src/db.cpp src/token.cpp)

target_include_directories(auth_module PRIVATE include)
target_link_libraries(auth_module PRIVATE Pistache mongocxx OpenSSL::Crypto)
