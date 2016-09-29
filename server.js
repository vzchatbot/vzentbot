var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('apiai');
var app = apiai("2a408bf5bb40488cb63d7efaee842140 ");

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
    appId: '31c8d108-cdc4-4474-8e08-c2f6a3b54364',
    appPassword: 'm5JLXWcRfymrNfHTta454Qj'
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {

    var request = app.textRequest(session.message.text);

    request.on('response', function (response) {
        session.send('you have type ' + session.message.text + ' hello world');
    });

    request.on('error', function (error) {
        console.log(error);
    });
    
    request.end()

   
});