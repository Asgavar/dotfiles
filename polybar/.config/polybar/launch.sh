#!/usr/bin/env bash

# Terminate already running bar instances
killall -q polybar

# Wait until the processes have been shut down
while pgrep -x wal > /dev/null; do sleep 1; done
while pgrep -x polybar >/dev/null; do sleep 1; done

python -m pywal -R

if type "xrandr"; then
    for m in $(xrandr --query | grep " connected" | cut -d" " -f1); do
        MONITOR=$m polybar --reload papiesz &
    done
else
    polybar --reload papiesz &
fi
