
include(FetchContent)
FetchContent_Declare(
  jwt-cpp
  GIT_REPOSITORY https://github.com/Thalhammer/jwt-cpp.git
  GIT_TAG v0.6.0 # Убедитесь, что используете последнюю стабильную версию
)
FetchContent_MakeAvailable(jwt-cpp)
