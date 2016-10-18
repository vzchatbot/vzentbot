var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('apiai');
var app = apiai("901c05fa26b7415196db699acdc5d193");

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: 'd5637416-8da0-442e-99a9-8c3867ffd9bf',
    appPassword: 'ZVfk1mP1bBLn4h2R5WLMjyP'
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// New =============
