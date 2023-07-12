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
1. You need Express server running already or create a new one.  
2. Install dependencies in folder where your server is: `npm install express better-sqlite3 body-parser`.
3. Create `.env` file if you dont have one yet with `DB_PATH=./example.db` and `ADMINPASS=something`.
4. Include `server.js` in your server (for example `app.use(require("./mood/server.js"))`).
5. Run/restart your server.
6. Open `/mood` in browser, open Console with F12, and enter `localStorage.admin = "something"`, if you're on mobile you can copypaste this into searchbar: `javascript:localStorage.admin="something"`.
7. Done!!!!!!
  
## Mood file format
Every mood is 6 bytes:
- `Int8` Pleasantness * 100
- `Int8` Energy * 100
- `UInt32BE` Date.now() / 1000 - mood_epoch
  
Mood epoch is by default `1682726400` (2023-04-29). It is advised to change this date in code to whatever day you start using moodtracker to have most years possible in future.  
