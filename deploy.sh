#!/bin/bash

# PRODUCTION
git reset --hard
git checkout master
git pull origin master

npm i yarn -g
yarn global add serve
yarn
yarn run build
# Eski (buzuq) jarayonni tozalab, PM2 ning o'z static-serveri bilan ishga tushiramiz.
# --spa: React Router uchun har yo'lni index.html ga yo'naltiradi (serve/yarn kerak emas).
pm2 delete GADJET-REACT 2>/dev/null || true
pm2 serve dist 2005 --spa --name GADJET-REACT