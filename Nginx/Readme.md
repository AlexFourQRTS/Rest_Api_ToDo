<!-- Сначала удалите стандартную конфигурацию Nginx: -->

sudo rm /etc/nginx/sites-enabled/default


<!-- Затем создайте ссылку (ярлык) на ваш файл nginx.conf: -->

sudo ln -s /home/zmxncbv/www/Rest_Api_ToDo/Nginx/nginx.conf /etc/nginx/sites-enabled/rest_api_todo.conf


<!-- Удалите старую символическую ссылку (если она была создана неправильно): -->

sudo rm /etc/nginx/sites-enabled/rest_api_todo.conf

<!-- Создайте новую символическую ссылку, указывая на ваш файл конфигурации по его полному, абсолютному пути. -->

sudo ln -s /home/zmxncbv/www/Rest_Api_ToDo/Nginx/default.conf /etc/nginx/sites-enabled/rest_api_todo.conf

sudo nginx -t

sudo systemctl reload nginx


