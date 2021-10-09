#/bin/bash


sh -c "echo timer > /sys/class/leds/beaglebone\:green\:usr0/trigger"
sh -c "echo 750 > /sys/class/leds/beaglebone\:green\:usr0/delay_on"
sh -c "echo 250 > /sys/class/leds/beaglebone\:green\:usr0/delay_off"
