git pull
sudo rm -rf /usr/share/nginx/html
sudo cp -r  /home/lighthouse/Subtle-Stirrings-fe/dist /usr/share/nginx/html
sudo systemctl restart nginx