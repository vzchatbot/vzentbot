var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('apiai');
var app = apiai("2a408bf5bb40488cb63d7efaee842140");

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

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {

    var request = app.textRequest(session.message.text);

    request.on('response', function (response) {

        var intent = "response.result.action";

        switch (intent) {
            case "showrecommendation":

                break;
        } 

        session.send('you have type ' + session.message.text + ' hello world');

    });

    request.on('error', function (error) {
        console.log(error);
    });
    
    request.end()

   
});
