var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('apiai');
var nconf = require('nconf');
var uuid = require('node-uuid');

nconf.file('./config/config.json');
var app = apiai("apiai:clientid");

//=========================================================
// Bot Setup
//=========================================================


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
    console.log('NODE_ENV: ' + nconf.get('NODE_ENV'));
    console.log('Microsoft_AppID: ' + nconf.get('msbot:Microsoft_AppID'));
    console.log('apiai: ' + nconf.get('apiai:clientid'));
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: nconf.get('msbot:Microsoft_AppID'),
    appPassword: nconf.get('msbot:Microsoft_AppPassword')
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
    var options = {
        sessionId: uuid.v1()
				}

    var request = app.textRequest(session.message.text, options);


    request.on('response', function (response) {

        var intent = response.result.action;
        console.log(JSON.stringify(response));


        session.send(response.result.fulfillment.speech);
       // session.send(response.result.fulfillment.data);
        session.send(response.result.fulfillment.data.facebook);
       session.send(response.result.fulfillment.data.facebook.attachment);

		/*var msg = new builder.Message(session).sourceEvent({
			
facebook: response.result.fulfillment.data.facebook.attachment
		});*/

        //console.log(JSON.stringify(msg));
        //session.send(msg);



    });

    request.on('error', function (error) {
        console.log(error);
    });

    request.end()


});
