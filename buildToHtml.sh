#!/bin/bash
clear
echo -e "\033[31m start to build:"
npm run build
echo -e "\033[31m build end and start to deploy..."
rm -r /home/luoguibin/MyWork/HTML/sghen/dist
cp -r ./dist /home/luoguibin/MyWork/HTML/sghen/
echo -e "\033[31m end"
echo -e "\033[0m "