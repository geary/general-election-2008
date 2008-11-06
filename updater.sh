#!/bin/sh

while [ 1 ]
do
        svn update && python fetcher.py && python voter.py
        echo Next update in 5 minutes
        sleep 300
do