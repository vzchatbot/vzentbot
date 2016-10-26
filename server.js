var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');
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
	
	if(Finished_Status == true)
	{
        	session.send(response.result.fulfillment.speech);
	}
	else //if(Finished_Status =="false")
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
 			    recommendTVNew('Trending',function (str) {recommendTVNew1(str,session)}); 
			    break;
			case "channelsearch":
		   	   ChnlSearch(response,function (str){ ChnlSearchCallback(str,session)}); 
			   break;
			case "programSearch":
  			    PgmSearch(response,function (str){ PgmSearchCallback(str,session)});
			    break;
			case "getStarted":

			    getStarted.dogetStarted(req, res);
			default:

			 }
    }

				
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
	 console.log(JSON.stringify(respobj)); 
	var msg = new builder.Message(usersession).sourceEvent(respobj);              
          usersession.send(msg);
}


function PgmSearch(apireq,callback) { 
         var strProgram =  apireq.result.parameters.Programs;
	 var strGenre =  apireq.result.parameters.Genre;
	 var strdate =  apireq.result.parameters.date;
	 var strChannelName =  apireq.result.parameters.Channel;
	 var strRegionId = "92377";
	 console.log("strProgram " + strProgram + "strGenre " + strGenre + "strdate " +strdate);
	
        var headersInfo = { "Content-Type": "application/json" };
	
	var args = {
		"headers": headersInfo,
		"json": {Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
			 Request: {ThisValue: 'EnhProgramSearch', 
				   BotstrTitleValue:strProgram, 
				   BotdtAirStartDateTime : strdate,
				   BotstrGenreRootId : strGenre,
				   BotstrStationCallSign:strChannelName,
				   BotstrFIOSRegionID : strRegionId
				  } 
			}
		};
	
	 console.log("args " + args);
	
    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
             
                 console.log("body " + body);
                callback(body);
            }
            else
            	console.log('error: ' + error + ' body: ' + body);
        }
    );
 } 
  
function PgmSearchCallback(apiresp,usersession) {
    var objToJson = {};
    objToJson = apiresp;
	var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
	 console.log("subflow " + JSON.stringify(subflow));
	var msg = new builder.Message(usersession).sourceEvent(subflow);              
        usersession.send(msg);
	
/*
    return ({
        speech: "Here is the program details you are looking for" ,
        displayText: "Here is the program details you are looking for" ,
        data: subflow,
        source: "Verizon.js"
    });
*/
} 

function ChnlSearch(apireq,callback) { 
	console.log("ChnlSearch called " );
	
      var strChannelName =  apireq.result.parameters.Channel.toUpperCase();
	
	  console.log("strChannelName " + strChannelName);
        var headersInfo = { "Content-Type": "application/json" };
	var args = {
		"headers": headersInfo,
		"json": {Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
			 Request: {ThisValue: 'ChannelSearch',BotstrStationCallSign:strChannelName} 
			}
		
	};
  console.log("json " + String(args));
	
    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
             
                 console.log("body " + body);
                callback(body);
            }
            else
            	console.log('error: ' + error + ' body: ' + body);
        }
    );
 } 
  
function ChnlSearchCallback(apiresp,usersession) {
    var objToJson = {};
    objToJson = apiresp;
	var chposition = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
	
	console.log("chposition :" + chposition)
	usersession.send ("You can watch it on channel # " + chposition);
	/*
    return ({
        speech: "You can watch it on channel # " + chposition  ,
        displayText: "You can watch it on channel # " + chposition  ,
       // data: subflow,
        source: "Verizon.js"
    });*/

} 

function recommendTVNew(pgmtype,callback) { 
       	console.log('inside external call ');
        var headersInfo = { "Content-Type": "application/json" };
	var args = {
		"headers": headersInfo,
		"json": {
			Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
			Request: {
				ThisValue: pgmtype, BotstrVCN:'3452'
			}
		}
	};
//https://www.verizon.com/fiostv/myservices/admin/testwhatshot.ashx 
	//https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx
    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
             
                 console.log("body " + body);
                callback(body);
            }
            else
            	console.log('error: ' + error + ' body: ' + body);
        }
    );
 } 
  
function recommendTVNew1(apiresp,usersession) {
    var objToJson = {};
    objToJson = apiresp;
	var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
	//var subflow = objToJson;
	console.log("subflow :" + subflow)
	var msg = new builder.Message(usersession).sourceEvent(subflow);              
        usersession.send(msg);
	
 /*   return ({
        speech: "Here are some recommendations for tonight",
        displayText: "TV recommendations",
        data: subflow,
        source: "Zero Service - app_zero.js"
    });*/

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
