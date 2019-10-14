electron-packager ./ floatinfo --overwrite=true;
electron-installer-debian --src floatinfo-linux-x64/ --dest out/ --arch amd64;
debtap out/floatinfo_1.0.0_amd64.deb;
pacman -U out/floatinfo-1.0.0-1-amd64.tar.gz;