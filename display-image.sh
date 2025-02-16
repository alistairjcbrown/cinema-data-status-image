node ./get-data
node ./generate-image
sudo fbi -T 2 -d /dev/fb0 -noverbose -a ./generate-image/image.png
