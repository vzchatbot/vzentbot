var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('apiai');
var app = apiai("901c05fa26b7415196db699acdc5d193");
//=============
session.send("hello there");
session.send("hello there %s", name);
//=============
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
bot.dialog('/', function (session)
           { 
    var options =
        {
            sessionId: '9f04e63b-9ca6-4243-95ef-936be5a94g12'
        } 
    var request = app.textRequest(session.message.text, options);   
    request.on('response', function (response) 
               {        
        var intent = response.result.action;
        //console.log(JSON.stringify(response));     
        session.send(response.result.fulfillment.speech);     
        var msg = new builder.Message(session).sourceEvent(
            {
                facebook: response.result.fulfillment.data.facebook.attachment  
            });
        //console.log(JSON.stringify(msg)); 
        session.send(msg);   
    });  
    request.on('error', function (error)
               {
                console.log(error);  
                                         }); 
    request.end()
}); 
