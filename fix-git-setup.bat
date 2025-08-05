@echo off
echo Исправление настройки Git для загрузки сайта...
echo.

REM Установка имени и email для Git
echo Введите ваш email GitHub:
set /p email="Email: "
echo Введите ваше имя GitHub:
set /p name="Имя: "

git config --global user.email "%email%"
git config --global user.name "%name%"

echo.
echo Создание коммита...
git add .
git commit -m "Первый коммит сайта"

echo.
echo Повторная попытка загрузки на GitHub...
git push -u origin main

echo.
echo Готово! Git настроен и сайт загружен.
pause
