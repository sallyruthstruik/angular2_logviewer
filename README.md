# Приложение для просмотра лог-данных из MongoDB

Установка:

* Системные зависимости:

  * nodejs v7.x (https://nodejs.org/en/download/package-manager/)
  * npm 
  * python3.5

* Установка глобальных зависимостей:

  ```
  sudo npm install -g typescript
  sudo npm install -g concurrently
  sudo npm install -g gulp
  sudo apt-get install python3-pip
  ```

* Перед сборкой клиента в app/constants.ts нужно указать корректный HOST апи.

* Сборка клиента:

  `gulp dist`

  собранная статика лежит в dist/*

* Установка зависимостей бэкенда:

```
sudo pip3 install -r requirements.txt
sudo python3 setup.py develop
```

* Запуск сервера:

`logviewer.py --bind <host>:<port>`

* Сервер будет сам раздавать index.html и статику из dist.
