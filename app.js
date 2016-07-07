"use strict";

const Botkit = require('botkit');
const http = require('http');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

const chuckUrl = 'http://api.icndb.com/jokes/random';
const slackUrl = 'https://slack.com/api';

// PASTE YOUR TOKEN HERE
let token = 'TOKEN_GO_HERE';


const request = require('request');

const controller = Botkit.slackbot();

const bot = controller.spawn({
  token: token
});

bot.startRTM((err,bot,payload) => {
  if (err)
    throw new Error('Could not connect to Slack');
});

controller.hears(["Am I a god ?", "Roundhouse kick", "I am Chuck Norris"],["ambient"], (bot,message) => {
	request(slackUrl+'/users.info?token='+token+'&user='+message.user, function (error, response, body) {

    	if (!error && response.statusCode == 200) {
	      	let info = JSON.parse(body);

	      	request(chuckUrl+'?firstName='+encodeURIComponent(info.user.profile.first_name)+'&lastName='+encodeURIComponent(info.user.profile.last_name), (error, response, body) => {
		    	if (!error && response.statusCode == 200) {
			      	let data = JSON.parse(body)
		    		bot.reply(message, entities.decode(data.value.joke));
		    	}
		  	});

    	}
  	});
});