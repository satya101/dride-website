#!/bin/bash


#-------------------------------------------------------
# Function to parse user's input.
#-------------------------------------------------------
# Arguments are: Yes-Enabled No-Enabled Quit-Enabled
YES_ANSWER=1
NO_ANSWER=2
QUIT_ANSWER=3
parse_user_input()
{
  if [ "$1" = "0" ] && [ "$2" = "0" ] && [ "$3" = "0" ]; then
    return
  fi
  while [ true ]; do
    Options="["
    if [ "$1" = "1" ]; then
      Options="${Options}y"
      if [ "$2" = "1" ] || [ "$3" = "1" ]; then
        Options="$Options/"
      fi
    fi
    if [ "$2" = "1" ]; then
      Options="${Options}n"
      if [ "$3" = "1" ]; then
        Options="$Options/"
      fi
    fi
    if [ "$3" = "1" ]; then
      Options="${Options}quit"
    fi
    Options="$Options]"
    read -p "$Options >> " USER_RESPONSE
    USER_RESPONSE=$(echo $USER_RESPONSE | awk '{print tolower($0)}')
    if [ "$USER_RESPONSE" = "y" ] && [ "$1" = "1" ]; then
      return $YES_ANSWER
    else
      if [ "$USER_RESPONSE" = "n" ] && [ "$2" = "1" ]; then
        return $NO_ANSWER
      else
        if [ "$USER_RESPONSE" = "quit" ] && [ "$3" = "1" ]; then
          printf "\nGoodbye.\n\n"
          exit
        fi
      fi
    fi
    printf "Please enter a valid response.\n"
  done
}


#-------------------------------------------------------
# Script to check if all is good before install script runs
#-------------------------------------------------------
clear
echo "====== Dride install script ======"
echo ""
echo ""
echo ""
echo "██████╗ ██████╗ ██╗██████╗ ███████╗"
echo "██╔══██╗██╔══██╗██║██╔══██╗██╔════╝"
echo "██║  ██║██████╔╝██║██║  ██║█████╗  "
echo "██║  ██║██╔══██╗██║██║  ██║██╔══╝  "
echo "██████╔╝██║  ██║██║██████╔╝███████╗"
echo "╚═════╝ ╚═╝  ╚═╝╚═╝╚═════╝ ╚══════╝"
echo ""
echo ""
echo "This will install all the necessary dependences and software for dride."
echo "======================================================="
echo ""
echo ""
parse_user_input 1 0 1

clear
echo ""
echo ""
echo "==============================="
echo "*******************************"
echo " *** STARTING INSTALLATION ***"
echo "  ** this may take a while **"
echo "   *************************"
echo "   ========================="
echo ""
echo ""



cd /home

# Install dependencies
echo "========== Update Aptitude ==========="
sudo apt-get update -y
# sudo apt-get upgrade

echo "========== Installing build-essential ============"
sudo apt-get install build-essential -y

echo "========== Installing libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev libjasper-dev python2.7-dev ============"
sudo apt-get install cmake git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev libjasper-dev python2.7-dev -y

echo "========== Installing pip ============"
sudo apt-get install python-pip -y

echo "========== Installing Numpy ============"
sudo pip install numpy


# Install Node
echo "========== Installing Node ============"
sudo wget http://node-arm.herokuapp.com/node_latest_armhf.deb 
sudo dpkg -i node_latest_armhf.deb



# TODO: Add a test if openCV was installed correctly

echo "========== Install Dride-core [Cardigan]  ============"
cd /home

sudo wget -c -O "drideOS-latest.zip" "https://s3.amazonaws.com/dride/releases/cardigan/latest.zip"
sudo mkdir Cardigan
sudo unzip "drideOS-latest" -d Cardigan

sudo rm -R __MACOSX

# make the video dir writable
sudo chmod 777 -R modules/video/


echo "========== Install picamera  ============"
sudo pip install picamera
sudo pip install "picamera[array]"
# enable camera on raspi-config
grep "start_x=1" /boot/config.txt
if grep "start_x=1" /boot/config.txt
then
        echo "Already enabled."
else
        sed -i "s/start_x=0/start_x=1/g" /boot/config.txt
        reboot
fi

echo "========== Setup sound to I2S  ============"
sudo curl -sS https://raw.githubusercontent.com/adafruit/Raspberry-Pi-Installer-Scripts/master/i2samp.sh | bash

echo "========== Install mpg123  ============"
sudo apt-get install mpg123 -y


# Install WIFi
sudo apt-get install hostapd isc-dhcp-server -y
sudo apt-get install iptables-persistent -y

cd /home 
# get the dhcpd config file
sudo wget https://dride.io/code/dhcpd.conf

sudo cp dhcpd.conf /etc/dhcp/dhcpd.conf
sudo rm dhcpd.conf


sudo bash -c 'echo "INTERFACES=\"wlan0\""> /etc/default/isc-dhcp-server'

sudo ifdown wlan0


sudo wget https://dride.io/code/interfaces

sudo cp interfaces /etc/network/interfaces
sudo rm interfaces


sudo ifconfig wlan0 192.168.42.1


sudo wget https://dride.io/code/hostapd.conf

sudo cp hostapd.conf /etc/hostapd/hostapd.conf
sudo rm hostapd.conf

sudo bash -c 'echo "DAEMON_CONF=\"/etc/hostapd/hostapd.conf\""> /etc/default/hostapd'

sudo wget https://dride.io/code/hostapd

sudo cp hostapd /etc/init.d/hostapd
sudo rm hostapd


sudo bash -c 'echo "net.ipv4.ip_forward=1"> /etc/sysctl.conf'
sudo sh -c "echo 1 > /proc/sys/net/ipv4/ip_forward"

sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
sudo iptables -A FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT
sudo iptables -A FORWARD -i wlan0 -o eth0 -j ACCEPT


sudo sh -c "iptables-save > /etc/iptables/rules.v4"

sudo mv /usr/share/dbus-1/system-services/fi.epitest.hostap.WPASupplicant.service ~/


sudo service hostapd start 
sudo service isc-dhcp-server start
sudo update-rc.d hostapd enable 
sudo update-rc.d isc-dhcp-server enable


# dride-ws
cd /home/Cardigan/dride-ws
sudo npm i --production

# bluetooth daemon
cd /home/Cardigan/daemons/bluetooth
sudo npm i --production


sudo wget https://dride.io/code/startup/dride-ws
sudo wget https://dride.io/code/startup/dride-core

#startup script's

# express on startup
sudo cp dride-ws /etc/init.d/dride-ws
sudo chmod +x /etc/init.d/dride-ws
sudo update-rc.d dride-ws defaults


sudo rm dride-ws

# dride-core on startup
sudo cp dride-core /etc/init.d/dride-core
sudo chmod +x /etc/init.d/dride-core
sudo update-rc.d dride-core defaults
sudo rm dride-core




# neo pixles
# sudo apt-get install build-essential python-dev git scons swig


## GPS  https://www.raspberrypi.org/forums/viewtopic.php?p=947968#p947968
echo "========== Install GPS  ============"
sudo apt-get install gpsd gpsd-clients cmake subversion build-essential espeak freeglut3-dev imagemagick libdbus-1-dev libdbus-glib-1-dev libdevil-dev libfontconfig1-dev libfreetype6-dev libfribidi-dev libgarmin-dev libglc-dev libgps-dev libgtk2.0-dev libimlib2-dev libpq-dev libqt4-dev libqtwebkit-dev librsvg2-bin libsdl-image1.2-dev libspeechd-dev libxml2-dev ttf-liberation -y

sudo pip install pyserial


echo "" >> /boot/config.txt
echo "core_freq=250" >> /boot/config.txt
echo "enable_uart=1" >> /boot/config.txt

echo "dwc_otg.lpm_enable=0  console=tty1 root=/dev/mmcblk0p2 rootfstype=ext4  elevator=deadline fsck.repair=yes   rootwait" > /boot/cmdline.txt



# 3)Run
sudo systemctl stop serial-getty@ttyS0.service
sudo systemctl disable serial-getty@ttyS0.service
sudo systemctl stop gpsd.socket
sudo systemctl disable gpsd.socket

# reboot

# 5) Execute the daemon reset
sudo killall gpsd
sudo gpsd /dev/ttyS0 -F /var/run/gpsd.sock






echo "========== Downloading and installing OpenCV ============"
cd ~
git clone https://github.com/Itseez/opencv.git
cd opencv
git checkout 3.1.0
echo "==>>>====== Building OpenCV ============"
cd ~/opencv
mkdir build
cd build
cmake -D CMAKE_BUILD_TYPE=RELEASE \
-D CMAKE_INSTALL_PREFIX=/usr/local ..
echo "==>>>====== This might take a long time.. ============"
make -j4

sudo make install
sudo ldconfig






sudo reboot
















echo ""
echo '============================='
echo '*****************************'
echo '========= Finished =========='
echo '*****************************'
echo '============================='
echo ""



