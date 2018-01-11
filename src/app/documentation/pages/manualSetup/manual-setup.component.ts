import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../../helpers/meta/meta.service'

@Component({
	selector: 'app-manual-setup',
	templateUrl: './manual-setup.component.html',
	styleUrls: ['../../documentation.component.scss'],
})
export class ManualSetupComponent implements OnInit {
	data: any = [];

	constructor(private meta: MetaService) {
	}

	ngOnInit() {
		this.meta.set(
			'Manual Setup',
			'Install drideOS on your own linux'
		)
		this.data = [
`
#-------------------------------------------------------
# Script to check if all is good before install script runs
#-------------------------------------------------------
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
# sudo apt-get update -y
# sudo apt-get upgrade

echo "========== Installing gpac ============"
sudo apt-get install gpac -y

echo "========== Installing htop ============"
sudo apt-get install htop -y


echo "========== Setup libav  ============"
sudo apt-get install libav-tools -y



# Install Node
echo "========== Installing Node ============"
wget -O - https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v8.9.0.sh | bash


echo "========== Installing pip ============"
sudo apt-get install python-pip -y


echo "========== Install picamera  ============"
sudo pip install "picamera[array]==1.12"


# enable camera on raspi-config and allocate more ram to the GPU
echo "" >> /boot/config.txt
echo "#enable piCaera" >> /boot/config.txt
echo "start_x=1" >> /boot/config.txt
echo "gpu_mem=128" >> /boot/config.txt
echo "dtparam=spi=on" >> /boot/config.txt


# Install WIFi
echo iptables-persistent iptables-persistent/autosave_v4 boolean true | sudo debconf-set-selections
echo iptables-persistent iptables-persistent/autosave_v6 boolean true | sudo debconf-set-selections

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




sudo pip install pyserial


#startup script's
sudo wget https://dride.io/code/startup/dride-ws


sudo wget https://dride.io/code/startup/dride-core


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

# drideOS-resize on startup


echo "========== Setup sound to I2S  ============"
sudo curl -sS https://dride.io/code/i2samp.sh  | bash


echo "========== Setup mic  ============"
# https://learn.adafruit.com/adafruit-i2s-mems-microphone-breakout/raspberry-pi-wiring-and-test


echo "========== Setup RTC  ============"
# https://learn.adafruit.com/adding-a-real-time-clock-to-raspberry-pi/set-rtc-time
sudo apt-get install python-smbus i2c-tools
# TODO: turn on ISC on raspi-config...




# add to sudo nano /boot/config.txt
echo "dtoverlay=i2c-rtc,ds3231" >> /boot/config.txt
echo "dtparam=i2c_arm=on" >> /boot/config.txt

# Remove hw-clock
sudo apt-get -y remove fake-hwclock
sudo update-rc.d -f fake-hwclock remove

# copy new file to
sudo wget https://dride.io/code/hwclock-set

sudo cp hwclock-set /lib/udev/hwclock-set
sudo rm hwclock-set

# we will sync the current date form the app using BLE
# looks at /daemon/bluetooth/updateDate.js


echo "========== Setup Accelerometer  ============"
# http://www.stuffaboutcode.com/2014/06/raspberry-pi-adxl345-accelerometer.html
# enable i2c 0
echo "dtparam=i2c_vc=on" >> /boot/config.txt









echo "========== Install Dride-core [Cardigan]  ============"
cd /home
# https://s3.amazonaws.com/dride/releases/cardigan/latest.zip
sudo mkdir Cardigan && cd Cardigan
sudo wget -c -O "cardigan.zip" "https://s3.amazonaws.com/dride/releases/cardigan/latest.zip"
sudo unzip "cardigan.zip"


sudo rm -R cardigan.zip


# make the video dir writable
sudo chmod 777 -R /home/Cardigan/modules/video/
sudo chmod 777 -R /home/Cardigan/modules/settings/
#make gps position writable
sudo chmod +x /home/Cardigan/daemons/gps/position

# make the firmware dir writable
sudo chmod 777 -R /home/Cardigan/firmware/

# run npm install on video module
cd /home/Cardigan/modules/video
sudo npm i --production


# run npm install on dride-ws
cd /home/Cardigan/dride-ws

sudo npm i --production


# setup clear cron job
crontab -l > cleanerJob
echo "* * * * * node /home/Cardigan/modules/video/helpers/cleaner.js" >> cleanerJob
#install new cron file
crontab cleanerJob
rm cleanerJob


echo "========== Install Indicators  ============"
echo "# Needed for SPI LED" >> /boot/config.txt
echo "core_freq=250" >> /boot/config.txt
sudo apt-get install scons
cd /home/Cardigan/modules/indicators
sudo scons
sudo apt-get install python-dev swig -y
cd /home/Cardigan/modules/indicators/python
sudo python setup.py install




echo "========== Setup bluetooth  ============"

sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev -y


# run npm install on Bluetooth daemon
cd /home/Cardigan/daemons/bluetooth
sudo npm i --production




echo ""
echo '============================='
echo '*****************************'
echo '========= Finished =========='
echo '*****************************'
echo '============================='
echo ""

`
		]
	}

}
