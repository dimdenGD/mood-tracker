# Mood Tracker
Webpage for tracking your mood (pleasantness / energy).  
![Screenshot](https://lune.dimden.dev/91444b3511.png)  
  
## Features
- Simple to integrate - just `require` the server.js file from your main Express server (it just exports Express Router)
- Easy to use - place dot using left click, save using right click (or hold on mobile)
- Has interesting analytics
- Easy to use API, easy to integrate in other places
- Very small optimized mood file (only for network, moods are stored in SQLite database)
- On average if you'll save your moods every 20 minutes (excluding sleeps) your mood file will only grow by 100 kB per YEAR
- With current network file configuration it can store moods for ~60 years before breaking
- Works offline - you just have to load page for the first time, then it'll work offline after (if there's no internet connection and you're saving mood, it'll get synchronized when you'll have connection again)
  
## Installation
### Into an Express server
1. You need Express server running already or create a new one.  
2. Install dependencies in folder where your server is: `npm install express better-sqlite3 body-parser dotenv`.
3. Create `.env` file if you dont have one yet with `DB_PATH=./example.db` and `ADMINPASS=something`.
4. Include `server.js` in your server (for example `app.use(require("./mood/server.js"))`).
5. Run/restart your server.
### As a standalone Docker container
1. Install `docker compose` if it is not already installed
2. Create a new user or pick an existing one to run the mood tracker. Pick a directory for the database which that user can read and write to.
3. Edit `docker-compose.yaml` to set the directory where the Database goes and the UID/GID for the user that can access it.
4. Edit the `.env` file in the `docker` folder to change the default token/password
5. The default port is 8228 (CAT -> 228 on a phone dialpad). If you want to change that, edit `app.js`in the `docker` folder
6. Run `sudo docker compose up` to start the moodtracker, or with the `-d` flag added, to start it as a service.

## Useage
1. Open `example.com:port/mood/auth.html` in your browser and enter the token from the `.env`file to be able to edit the mood.
   You have to replace `example.com` and `port` with the actual address and port of your server of course.
2. Go to `example.com:port/mood`
3. Right click (or hold on phone) on dot to save mood.
  
## Mood file format
Every mood is 6 bytes:
- `Int8` Pleasantness * 100
- `Int8` Energy * 100
- `UInt32BE` Date.now() / 1000 - mood_epoch
  
Mood epoch is by default `1682726400` (2023-04-29). It is advised to change this date in code to whatever day you start using moodtracker to have most years possible in future.  
