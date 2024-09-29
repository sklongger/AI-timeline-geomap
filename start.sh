# git pull
# npm run build
sudo rm -rf /usr/share/nginx/html
# sudo cp -r  /home/lighthouse/AI-timeline-geomap/dist /usr/share/nginx/html
sudo cp -r  /home/lighthouse/dist /usr/share/nginx/html
sudo systemctl restart nginx