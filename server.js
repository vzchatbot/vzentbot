var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('apiai');
var nconf = require('nconf');
var uuid = require('node-uuid');

nconf.file('./config/config.json');
var app = apiai(nconf.get('apiai:clientid'));

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
    var options = {sessionId: '9dbb0570-9a8b-11e6-a1e7-afc8eaec72d6'}

    var request = app.textRequest(session.message.text, options);
    request.on('response', function (response) {
        var intent = response.result.action;
        console.log(JSON.stringify(response));
	var Finished_Status=response.result.actionIncomplete;
	 console.log("Finished_Status "+ Finished_Status);
	if(Finished_Status !=="true")
	{
        	session.send(response.result.fulfillment.speech);
	}
	    else if(Finished_Status =="false")
	    {
		    console.log("-----------INTENT SELECTION-----------");
		    var straction =response.result.action;
		    console.log("Selected_intentName : "+ straction);
		    
           	    switch (straction) {
				    
			 case "getStarted":
			    welcomeMsg(session);
			   break;
			    case "recordnew":
			    var Record = require('./modules/record.js').Record;
			    Record.doRecord(session, response, builder);

			  /*  case "recordnew":
			    var Record = require('./modules/record.js').Record;
			    Record.doRecord(session, response, builder);				    
			    break; */

			case "LinkOptions":

			      var linkOptions = require('./modules/LinkOptions.js').LinkOptions;
			    break;
			case "MoreOptions":
			    var moreOptions = require('./modules/MoreOptions.js').MoreOptions;
			    break;
			case "Billing":
			  //  var billing = require('./modules/MoreOptions.js').Billing;				    				   
			     testmethod(session);
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


function welcomeMsg(usersession)
{
    console.log("inside welcomeMsg");
    var respobj= {
  "facebook": {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "Want to know what’s on tonight? When your favorite sports team is playing? What time your favorite show is coming on? I can answer almost anything, so try me! Before we get started—let’s take a few minutes to get me linked to your Verizon account, this way I can send you personalized recommendations, alerts.",
        "buttons": [
          {
            "type": "postback",
            "title": "Link Account",
            "payload": "Link Account"
          },
          {
            "type": "postback",
            "title": "Maybe later",
            "payload": "Main Menu"
          }
        ]
      }
    }
  }
};
	 console.log(JSON.stringy(respobj)); 
	var msg = new builder.Message(usersession).sourceEvent(respobj);              
          usersession.send(msg);
}


function testmethod(usersession)
{
 console.log("inside test method");
	var myobj=  {                  
						  "facebook": {
						"attachment": {
							"type": "template",
							"payload": {
								"template_type": "button",
								"text": "Are you looking for something to watch, or do you want to see more options? Type or tap below.",
								"buttons": [
									{
										"type": "postback",
										"title": "What's on tonight?",
										"payload": "On Later"
									},
									{
										"type": "postback",
										"title": "More Options",
										"payload": "More Options"
									}
								]
							}
						}}};
	
	  var msg = new builder.Message(usersession).sourceEvent(  
                                            myobj               
						);              
                                     usersession.send(msg);
	
	
	/*
usersession.send ( 
		{	"facebook": {
			"attachment": {
				"type": "template",
				"payload": {
					"template_type": "button",
					"text": "Are you looking for something to watch, or do you want to see more options? Type or tap below.",
					"buttons": [
						{
							"type": "postback",
							"title": "What's on tonight?",
							"payload": "On Later"
						},
						{
							"type": "postback",
							"title": "More Options",
							"payload": "More Options"
						}
					]
				}
			
		}}}
	);	
*/

}
