## 🔗 Ссылки и материалы для разработки приложения

---

**Github Репозиторий**
`https://github.com/ItsZeroFour/questionnaire`

**Git и GitBash**
`https://git-scm.com/downloads`

**Задания**
`https://github.com/VladimirChabanov/alg_and_prog_2024/blob/main/02_practice/03_group_project/ReadMe.md`

---

> Команды для разработки (Git)

**_Клонирование репозитория_**: `git clone`

**_Добавление изменений в свою рабочую область_**: `git pull`

> Команды для добавления изменений в репозиторий (Git)
> Последовательно:

1.  `git add .` - Добавление изменений
2.  `git commit -m "Кратко обозначьте что изменили"` - Сохранение добавленных изменений
3.  `git push` - Загрузка изменений в репозиторий

<a href="https://chatgpt.com/share/673f0b00-b4b8-8010-b92a-13ad302d89bc">Как начать работать с Git</a> (Вам хватит информации до 5 пункта)
<a href="https://www.youtube.com/watch?v=EeARyFrZsnU">Что такое Git и для чего он нужен</a>
<a href="https://chatgpt.com/share/673f111f-3134-8010-a9af-08938a2a0607">Как лидеру команды добавить всех участников в git, что бы вместе работать над проектом</a>

---

## 🧑 Распределение ролей:

_Лидер: Основная часть + модуль web версии приложения_

_Бегун Руслан Борисович: Модуль подключения приложения к телеграму_

_Все кроме лидера группы: Модуль авторизации_

---

## 🚪 Что нужно для модуля авторизации:

1. _Создание авторизации и запись данных в базу данных mongoDB_ <a href="https://chatgpt.com/share/673e06b5-153c-8013-8d18-c2daed511650">Подробнее</a>
2. _jwt токен_ <a href="https://chatgpt.com/share/673e0573-4230-8013-b4e0-f5e1bf7e8439">Подробнее</a>
3. _Postman для отправки запросов к серверу_ <a href="https://www.youtube.com/watch?v=Q7lwrypKSc4">Подробнее</a>
4. _Подключение сервисов к http для получения к ним доступа_ <a href="https://chatgpt.com/share/673e07ca-4634-8013-b2c7-5b0752fcbb42">Подробнее</a>
5. _Запуска приложения на C++ что бы оно работало без постоянного ввода команды для запуска_ <a href="https://chatgpt.com/share/673e08dd-63e4-8010-8ea8-2f605076d907">Подробнее</a>
6. _Добавление ID опроса пользователя в объект пользователя на стороне C++_ <a href="https://chatgpt.com/share/673eff3f-0ed0-8010-b508-08786d24a9b6">Подробнее</a>

---

## 📟 База данных MongoDB

> После создания базы данных Mongo, что бы она у вас работала, вам необходимо в право боковой панели найти вкладку Network Access. В этой вкладке снизу "Actions" будет кнопка "Edit". Нажмите на нее и после нажмите на Access from anywhere. Теперь вы можете работать с базой данных без региональных ограничений 

**URI Базы Данных:**

<img src="https://i.ibb.co/6sq3vjn/image.png" alt="mongoDB C++" width="100%" height="auto"/>

`mongodb+srv://questionnaire:<db_password>@cluster0.zjqrx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

Пароль запрашивать у лидера команды

<a href="https://www.mongodb.com/docs/languages/cpp/cpp-driver/current/#installation">Ознакомьтесь с инструкциями по установке драйвера MongoDB C++</a>


### Полный пример кода для иницализации базы данных MongoDB:*
```
#include <bsoncxx/json.hpp>
#include <mongocxx/client.hpp>
#include <mongocxx/instance.hpp>
int main()
{
  try
  {
    // Create an instance.
    mongocxx::instance inst{};
    
    const auto uri = mongocxx::uri{"mongodb+srv://questionnaire:<db_password>@cluster0.zjqrx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"};

    // Set the version of the Stable API on the client
    mongocxx::options::client client_options;
    const auto api = mongocxx::options::server_api{mongocxx::options::server_api::version::k_version_1};
    client_options.server_api_opts(api);
    
    // Setup the connection and get a handle on the "admin" database.
    mongocxx::client conn{ uri, client_options };
    mongocxx::database db = conn["admin"];
    
    // Ping the database.
    const auto ping_cmd = bsoncxx::builder::basic::make_document(bsoncxx::builder::basic::kvp("ping", 1));
    db.run_command(ping_cmd.view());
    std::cout << "Pinged your deployment. You successfully connected to MongoDB!" << std::endl;
  }
  catch (const std::exception& e)
  {
    // Handle errors
    std::cout<< "Exception: " << e.what() << std::endl;
  }
  return 0;
}
```