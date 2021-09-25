#!/usr/bin/env bash
cd application
gnome-terminal --tab --title="Metro" -- bash -c "npx react-native start"
gnome-terminal --tab --title="Run Android" -- bash -c "source $HOME/.bash_profile; npx react-native run-android"

