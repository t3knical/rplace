# rplace

This is a functional Canadian Flag @ 175,484 bot for the r/place 2022 event.

Based on code from https://github.com/goatgoose/PlaceBot and https://github.com/rdeepak2002/reddit-place-script-2022.

## Functionality
- does NOT use the reddit API
- Convert input image to be drawn to target configuration, ignores transparent pixels
- Supports multiple accounts
- Supports obtaining the target configuration from a server (or local file) to prevent outdated templates
- Supports multiple canvases (2 at the time of writing)
- Goes to sleep when only few mismatched pixels remain

## Installation
For windows just pip install all the requirements in the requirements.txt file then edit the user(s) in config.json and finally run the start.bat after you fix the directory it's pointing to inside the bat file. (just edit it with notepad). 

P.S: I used Python 3.7.0 to get it going.

## Current Preview
![alt text](https://github.com/t3knical/rplace/blob/main/current%20preview.png?raw=true)
