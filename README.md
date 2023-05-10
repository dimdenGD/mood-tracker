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

## Mood file format
Every mood is 6 bytes:
- `Int8` Pleasantness * 100
- `Int8` Energy * 100
- `UInt32BE` Date.now() / 1000 - mood_epoch
  
Mood epoch is by default `1682726400` (2023-04-29). It is advised to change this date in code to whatever day you start using moodtracker to have most years possible in future.  