const Discord = require('discord.js');
const client = new Discord.Client();
const express = require('express');
const fs = require('fs');
const moment = require('moment');
const superagent = require('superagent');
const users = require('./models/users');
const guilds = require('./models/guilds');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
mongoose.connect(process.env.mongodb, {useNewUrlParser: true}, (err) => {
if (err) return console.log(err)
console.log('Connected')
});

process.env.TZ = 'EST';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function(request, response) {
  response.sendStatus(200)
});

fs.readdir('./events', (err, files) => {
if (err) console.log(err)
files.forEach(file => {
const event = require(`./events/${file}`);
let eventName = file.split('.')[0];
client.on(eventName, event.bind(null, client));
});
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
  
  if (err) console.log(err)
  
  let jsfile = files.filter(f => f.split('.').pop() === 'js')
  if (jsfile.length <= 0) {
    return console.log("Couldn't find commands");
  }
  
  jsfile.forEach((f, i) => {
  let props = require(`./commands/${f}`);
  console.log(`${f} loaded!`);
  client.commands.set(props.help.name, props);
  props.help.aliases.forEach(alias => {
  client.aliases.set(alias, props.help.name)
})
})
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

client.login(process.env.token)