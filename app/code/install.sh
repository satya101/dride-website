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
sudo apt-get install cmake git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev libjasper-dev python2.7-dev

echo "========== Installing pip ============"
wget https://bootstrap.pypa.io/get-pip.py
sudo python get-pip.py

echo "========== Installing Numpy ============"
sudo pip install numpy


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




# Install Node
echo "========== Installing Node ============"
sudo wget http://node-arm.herokuapp.com/node_latest_armhf.deb 
sudo dpkg -i node_latest_armhf.deb



# TODO: Add a test if openCV was installed correctly

echo "========== Install Dride-core [Cardigan]  ============"
cd /home
sudo git clone --recursive https://github.com/CardiganCam/Cardigan.git
cd Cardigan


echo "========== Install picamera  ============"
sudo pip install "picamera[array]"
# enable camera on raspi-config

echo "========== Install omxplayer  ============"
sudo apt-get install omxplayer -y







# TODO: Setup WIFI  + startup script's + dride-ws















echo ""
echo '============================='
echo '*****************************'
echo '========= Finished =========='
echo '*****************************'
echo '============================='
echo ""



