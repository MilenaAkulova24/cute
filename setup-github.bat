@echo off
echo Установка Git и загрузка сайта на GitHub...
echo.

REM Проверка наличия Git
git --version >nul 2>&1
if errorlevel 1 (
    echo Git не найден. Пожалуйста, установите Git с https://git-scm.com/download/win
    pause
    exit /b
)

REM Инициализация репозитория
echo Инициализация Git репозитория...
git init

REM Добавление всех файлов
echo Добавление файлов...
git add .

REM Первый коммит
echo Создание первого коммита...
git commit -m "Первый коммит сайта"

REM Добавление удаленного репозитория
echo Добавление GitHub репозитория...
git remote add origin https://github.com/MilenaAkulova24/cute.git

REM Переименование ветки
echo Переименование ветки в main...
git branch -M main

REM Загрузка на GitHub
echo Загрузка на GitHub...
git push -u origin main

echo.
echo Готово! Ваш сайт загружен на GitHub.
pause
