#!/bin/bash

# Define an array of port numbers you want to check

cd /home/carl/Projects/exjobb

killall -9 -q node

kill_all_processes() {
    killall -9 node
}

trap "kill_all_processes" EXIT

node index.js &
node websocket/websocket-server.js &
node webtransport/webtransport-server.js &
node webtransport/webtransport-server-unreliable.js &

echo "Press CTRL+C to exit the script..."
sleep infinity
