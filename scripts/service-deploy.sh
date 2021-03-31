#!/bin/bash

if [[ "$1" == "master" ]]; then
	echo
	echo Deploying Senti Cloud Functions $1 ...
	rsync -r --quiet $2/ deploy@rey.webhouse.net:/srv/nodejs/senti/services/cloudfunctions/production
	echo
	echo Restarting Senti Cloud Functions service: $1 ...
	ssh deploy@rey.webhouse.net "sudo /srv/nodejs/senti/services/cloudfunctions/production/scripts/service-restart.sh master $3"
	echo
	echo Deployment to Senti Cloud Functions $1 and restart done!
	exit 0
fi

if [[ "$1" == "dev" ]]; then
	echo
	echo Deploying Senti Cloud Functions $1 ...
	rsync -r --quiet $2/ deploy@rey.webhouse.net:/srv/nodejs/senti/services/cloudfunctions/development
	echo
	echo Restarting Senti Cloud Functions service: $1 ...
	ssh deploy@rey.webhouse.net "sudo /srv/nodejs/senti/services/cloudfunctions/development/scripts/service-restart.sh dev $3"
	echo
	echo Deployment to Senti Cloud Functions $1 and restart done!
	exit 0
fi