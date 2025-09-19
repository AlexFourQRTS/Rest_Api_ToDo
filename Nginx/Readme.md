<!-- Сначала удалите стандартную конфигурацию Nginx: -->

sudo rm /etc/nginx/sites-enabled/default


<!-- Затем создайте ссылку на ваш файл nginx.conf: -->

sudo ln -s /home/zmxncbv/www/Rest_Api_ToDo/Nginx/nginx.conf /etc/nginx/sites-enabled/rest_api_todo.conf

