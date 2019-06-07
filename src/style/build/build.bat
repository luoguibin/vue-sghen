:: vue build .\theme-default.vue
cd .\dist\css\
ren app.*.css theme-default.css
cd ..\..\
copy .\dist\css\theme-default.css ..\
rd /s /q .\node_modules
rd /s /q .\dist