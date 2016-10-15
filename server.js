var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('apiai');
var app = apiai("19c8bad1930f4e28ad3527a8a69fda04");

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
       var options = {
		sessionId: '9f04e63b-9ca6-4243-95ef-936be5a94g12'
				}

	var request = app.textRequest(session.message.text, options);
    
    
    request.on('response', function (response) {

        var intent = response.result.action;
//console.log(JSON.stringify(response));
        
session.send(response.result.fulfillment.data.facebook );



		/*var msg = new builder.Message(session).sourceEvent({
			
facebook: response.result.fulfillment.data.facebook.attachment
		});*/

//console.log(JSON.stringify(msg));
		session.send(msg);
      
        

    });

    request.on('error', function (error) {
        console.log(error);
    });
    
    request.end()

   
});
