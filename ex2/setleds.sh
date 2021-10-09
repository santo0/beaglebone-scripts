#!/bin/bash

#First EOS assignment
#Authors: Marti La Rosa (313289), Xavier Nadal (313287)

LED_PATH="/sys/class/leds/beaglebone:green:usr"
LED=$1
MODE=$2
FREQ=$3
LED_LIST="0 1 2 3"
SELECTED_LEDS=""

function set_brightness() {
	for ledp in $SELECTED_LEDS; do
		cd $ledp
		echo none > trigger
		echo $1 > brightness
	done
}

function set_trigger() {
	for ledp in $SELECTED_LEDS; do
		cd $ledp
		echo $1 > trigger
	done
}

function set_default() {
#heartbeat, mmc0, cpu0, mmc1
	for ledp in $SELECTED_LEDS; do
		cd $ledp
		sel_led=$(echo $ledp | grep -o "usr[0-3]")
		case $sel_led in 
			usr0)
				echo "heartbeat" > trigger
				;;
			usr1)
				echo "mmc0" > trigger
				;;
			usr2)
				echo "cpu0" > trigger
				;;
			usr3)
				echo "mmc1" > trigger
				;;
			*)
				echo "Unknown led $sel_led"
				;;	
		esac

	done
}


if [[ $1 = "--help" ]]; then
	echo "Usage: setleds.sh led_number mode [blink_frequency]"
	echo "    led_number: led0|led1|led2|led3"
	echo "    mode: on|off|heartbeat|blink|default"
	echo "    if mode is blink, then blink_frequency"
	exit 0
fi

if [ $# -lt 2 ]; then 
	echo "Not enough arguments: min 2"
	echo "Use --help for more information"
	exit 1 
fi

if [[ $LED =~ led0|led1|led2|led3 ]]; then
	SELECTED_LEDS="$LED_PATH${LED:3:1}/"
elif [ $LED = "all" ]; then
	for i in $LED_LIST; do
		SELECTED_LEDS+="$LED_PATH$i/ "
	done
else
	echo "Unknown led"
	echo "Use --help for more information"
	exit 1
fi

case $MODE in
	on)
		set_brightness "1"
		;;
	off)
		set_brightness "0"
		;;
	heartbeat)
		set_trigger "heartbeat"
		;;
	default)
		set_default		
		;;
	blink)
		if ! [[ $FREQ =~ ^[0-9]+$ ]]; then
			echo "Given frequency is not an integer"
			echo "Use --help for more information"
			exit 1
		fi
		for ledp in $SELECTED_LEDS; do
			cd $ledp
			echo timer > trigger
			hz=$((1000 / $FREQ))
			sh -c "echo $hz > delay_on"
			sh -c "echo $hz > delay_off"
		done
		;;
	*)
		echo "Unknown mode"
		echo "Use --help for more information"
		exit 1
		;;
esac

exit 0


