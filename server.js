require('dotenv').config()

const express = require("express");
const Database = require('better-sqlite3');
const bodyParser = require('body-parser');
const path = require('path');

const app = express.Router();
const db = new Database(process.env.DB_PATH);
db.pragma("journal_mode = WAL");
db.exec(`
	create table if not exists moods (
		id integer primary key autoincrement,
		pleasantness integer default 0,
		energy integer default 0,
		timestamp integer default 0
	);
`);

app.get('/services/mood/get', (req, res) => {
	let lastMood = db.prepare(`select * from moods order by timestamp desc limit 1`).get();
	return res.json(lastMood);
});
const mood_epoch = 1682726400; // Math.round(new Date("2023-04-29").getTime() / 1000)
app.get('/services/mood/file.mood', (req, res) => {
	let after = +req.query.after || 0;
	let moods = db.prepare(`select * from moods where timestamp > ? order by timestamp desc`).all(after);

	res.setHeader("Content-Length", moods.length * 6);
	res.contentType("application/octet-stream");

	for(let i = 0; i < moods.length; i++) {
		let b = Buffer.alloc(6);
		let pleasantness = moods[i].pleasantness * 100;
		let energy = moods[i].energy * 100;
		let time = Math.round(moods[i].timestamp / 1000);

		b.writeInt8(pleasantness, 0);
		b.writeInt8(energy, 1);
		b.writeUInt32BE(time - mood_epoch, 2);

		res.write(b);
	}
	res.end();
});
app.post('/services/mood/set', bodyParser.json(), (req, res) => {
	let pass = req.body.pass;
	if(pass !== process.env.ADMINPASS) return res.send("wrong pass");
	let pleasantness = +req.body.pleasantness;
	let energy = +req.body.energy;
	if(!isFinite(pleasantness) || !isFinite(energy)) return res.send("invalid mood");
	if(pleasantness < -1 || pleasantness > 1 || energy < -1 || energy > 1) return res.send("invalid mood");

	let lastMood = db.prepare(`select * from moods order by timestamp desc limit 1`).get();
	if(lastMood && Date.now() - lastMood.timestamp < 1000 * 60) {
		db.prepare(`update moods set pleasantness = ?, energy = ? where id = ?`).run(pleasantness, energy, lastMood.id);
		res.send("edited");
	} else {
		db.prepare(`insert into moods (pleasantness, energy, timestamp) values (?, ?, ?)`).run(pleasantness, energy, Date.now());
		res.send("added");
	}
});
app.post('/services/mood/setmultiple', bodyParser.json(), (req, res) => {
	let pass = req.body.pass;
	if(pass !== process.env.ADMINPASS) return res.send("wrong pass");
	if(!req.body.moods) return res.send("no moods");

	for(let mood of req.body.moods) {
		let pleasantness = +mood.pleasantness;
		let energy = +mood.energy;
		if(!isFinite(pleasantness) || !isFinite(energy)) return res.send("invalid mood");
		if(pleasantness < -1 || pleasantness > 1 || energy < -1 || energy > 1) return res.send("invalid mood");
		
		db.prepare(`insert into moods (pleasantness, energy, timestamp) values (?, ?, ?)`).run(pleasantness, energy, mood.timestamp);
	}
	res.send("added");
});

app.use(express.static(path.join(__dirname, "public")));

console.log("Mood service started.");

module.exports = app;
