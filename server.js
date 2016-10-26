var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('apiai');
var app = apiai("db847b425ad44ca38e2d696d8b0750cd"); // Mine
//var nconf = require('nconf');
//var uuid = require('node-uuid');

//nconf.file('./config.json');
//var app = apiai(nconf.get('apiai:clientid'));

//=========================================================
// Bot Setup
//=========================================================


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    //console.log('%s listening to %s', server.name, server.url);
    //console.log('NODE_ENV: ' + nconf.get('NODE_ENV'));
    //console.log('Microsoft_AppID: ' + nconf.get('msbot:Microsoft_AppID'));
    //console.log('apiai: ' + nconf.get('apiai:clientid'));
});

// Create chat bot
var connector = new builder.ChatConnector({
    //appId: nconf.get('msbot:Microsoft_AppID'),
    //appPassword: nconf.get('msbot:Microsoft_AppPassword')
     appId: '4f5df286-2591-477d-af7d-547dd13a0156',
    appPassword: 'oTwfDnKyx1gCwiQoP53k2oC'
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
    var options = { sessionId: '94642ab5-31b3-4eac-aa1f-d4ef57284007' }

    var request = app.textRequest(session.message.text, options);
    request.on('response', function (response) {
        var intent = response.result.action;
        console.log(JSON.stringify(response));
        var Finished_Status = response.result.fulfillment.speech
        console.log("Finished_Status " + Finished_Status);
        if (Finished_Status !== "IntentFinished") {
            session.send(response.result.fulfillment.speech);
            console.log("-----------INTENT NOT YET FINISHED-----------");
        }
        else if (Finished_Status == "IntentFinished") {
            console.log("-----------INTENT SELECTION-----------");
            var Selected_intentName = response.result.fulfillment.source
            console.log("Selected_intentName : " + Selected_intentName);

            switch (Selected_intentName) {

                case "welcome":
                    var welcome = require('./modules/welcome.js').Welcome;
                    break;
                case "recordnew":
                    var Record = require('./modules/record.js').Record;
                    Record.doRecord(session, response, builder);

                    /*  case "recordnew":
                      var Record = require('./modules/record.js').Record;
                      Record.doRecord(session, response, builder);				    
                      break; */

                case "LinkOptions":


                    break;
                case "MoreOptions":
                    var moreOptions = require('./modules/MoreOptions.js').MoreOptions;
                    break;
                case "Billing":
                    var billing = require('./modules/MoreOptions.js').Billing;
                    break;
                case "stblist":

                    break;
                case "upsell":

                    break;
                case "upgradeDVR":

                    break;
                case "stgexternalcall":

                    break;
                case "Trending":

                    break;
                case "recommendation":

                    break;
                case "channelsearch":

                    break;
                case "programSearchdummy":

                    break;
                case "programSearch":

                    break;
                case "getStarted":

                    getStarted.dogetStarted(req, res);
                default:

            }
        }

        //var msg = new builder.Message(session).attachment(response.result.fulfillment.data.facebook.attachment);
        //console.log(JSON.stringify(msg));
        //session.send(msg);
    });
    request.on('error', function (error) {
        console.log(error);
    });

    request.end()


});
