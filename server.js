var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('apiai');
var app = apiai("db847b425ad44ca38e2d696d8b0750cd");

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
    appId: '4f5df286-2591-477d-af7d-547dd13a0156',
    appPassword: 'oTwfDnKyx1gCwiQoP53k2oC'
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
