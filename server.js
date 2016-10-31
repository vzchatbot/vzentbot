var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');
var apiai = require('apiai');
var nconf = require('nconf');
var uuid = require('node-uuid');
var fs = require('fs');
nconf.file('./config/config.json');
var app = apiai(nconf.get('apiai:clientid'));

// load server side templates into object for use: template.index() 
loaddir = require('loaddir');
jade = require('jade');
loaddir({
 
  // outputs directories as subObjects, names are filenames 
  asObject: true,
 
  path: __dirname + '/templates',
 
  // Runs 1st 
  compile: function() {
    this.fileContents = jade.compile(fileContents);
  },
  // Runs 2nd 
  callback: function(){
    console.log('Something loaded!', this.filePath);
  },
 
}).then(function(templates) {
 
  var outputSTR = templates.myFileName();
  
  // since we did `asObject`, directories are sub objects 
  var otherSTR = templates.myDirectory.subFile()
  
  // not using `asObject`  would look like this 
  // var otherSTR = templates['myDirectory/subFile']() 
});
//===================================================
//=============== Logging in MongoDB =========================
/*var Users = require("./users").Users;
var users = new Users("localhost", 27017);

users.findAll(function (err, user) {
	//do something
	});
*/
//=================== Logging In text file ===================
var logger = require('./log');
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

server.get('/api/log', function (req, res) {
	
	fs.readFile('./debug.log', 'utf8', function(err, contents) {
          res.end(contents);
        });
	fs.readFile('./exceptions.log', 'utf8', function(err, contents) {
          res.end(contents);
        });
	 
});
//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
   
	var options = {};
	 console.log("session id : "+ session.userData.sessionId);
	 console.error = console.log;
	//check session id exists, if not create one.
	if (session.userData.sessionId == undefined)
	{  
		var guid = uuid.v1();
		options = {sessionId:guid };
		console.log("New id.. Sessionid:" + guid );
		logger.info('log to file');
		logger.info("New id.. Sessionid:" + guid );
		session.userData.sessionId = guid;
	}
	else
	{ options = {sessionId: session.userData.sessionId}}
	
   //account linking check
        if (session.message.sourceEvent.account_linking == undefined) 
	{
            console.log("Account Linking null");
        }
        else {
            console.log("Account Linking convert: " + JSON.stringify(session.message.sourceEvent.account_linking, null, 2));
            console.log("Account Linking convert: " + JSON.stringify(session.message.sourceEvent.account_linking.authorization_code, null, 2));
            console.log("Account Linking convert: " + JSON.stringify(session.message.sourceEvent.account_linking.status, null, 2));

        }
	// Log the conversation of the user
	console.log("Conversation: session id : "+ session.userData.sessionId + " User Typed:" + session.message.text);
	logger.info("Conversation: session id : "+ session.userData.sessionId + " User Typed:" + session.message.text)
	//send request to api.ai
    	var request = app.textRequest(session.message.text, options);
	
    	request.on('response', function (response) 
	{
		var intent = response.result.metadata.intentName;
		console.log(JSON.stringify(response));
		logger.info(JSON.stringify(response));
		var Finished_Status=response.result.actionIncomplete;
		 console.log("Intent Progress_Status "+ Finished_Status);
		logger.info("Intent Progress_Status "+ Finished_Status);
	// see if the intent is not finished play the prompt of API.ai or fall back messages
	if(Finished_Status == true || intent=="Default Fallback Intent" ) 
	{
		console.log("-----------INTENT collection In-Progress-----------");
		logger.info("-----------INTENT collection In-Progress-----------");
		
                session.send(response.result.fulfillment.speech);
	}
	else //if the intent is complete do action
	{
		    console.log("-----------INTENT SELECTION-----------");
		    var straction =response.result.action;
		    console.log("Selected_action : "+ straction);
		    logger.info("Selected_action : "+ straction);
		   // Methods to be called based on action 
           	    switch (straction) 
		    {
			 case "getStarted":
			   //getprofile (session) ;
			   welcomeMsg(session);  
			   break;
			case "LinkOptions":
			    //LinkOptions(response,session);
			    accountlinking(response,session);
			    break;
			case "MoreOptions":
			    session.send(response.result.fulfillment.speech);
			    break;
			case "MainMenu":
			    MainMenu(session);
			    break;
			case "record":
			     RecordScenario (response,session); 
			     break;  
			case "CategoryList":
			     CategoryList(response,session);
			     break;
			case "recommendation":
 			    recommendations('whatshot',function (str) {recommendationsCallback(str,session)}); 
			    break;
			case "channelsearch":
		   	   ChnlSearch(response,function (str){ ChnlSearchCallback(str,session)}); 
			   break;
			case "programSearch":
  			    PgmSearch(response,function (str){ PgmSearchCallback(str,session)});
			    break;
			case "Billing":
			     testmethod(session);
			    break;
			case "demowhatshot":
			    demowhatshot(session);
			    break;
			default:
			     session.send(response.result.fulfillment.speech);
			 }
    }

				
    });
    request.on('error', function (error) {
        console.log(error);
    });

    request.end()


});


// Get facebook users profile
 function getprofile (session) 
 {
        console.log("=== DIALOG: GETPROFILE | STEP: 1/1 ====");
        //console.log(session);
        // Store the returned user page-scoped id (USER_ID) and page id
        session.userData.userid = session.message.sourceEvent.sender.id;
        session.userData.pageid = session.message.sourceEvent.recipient.id;

        console.log("FB User ID " + session.userData.userid);
        console.log("FB Page ID " + session.userData.pageid);

        // Let the user know we are 'working'
        //session.sendTyping();
        // Get the users profile information from FB
        request({
            url: 'https://graph.facebook.com/v2.8/' + session.userData.userid + '?fields=first_name,last_name,profile_pic,locale,timezone,gender',
            qs: { access_token: 'EAAYeV8WAScYBAN9UT9yRYZAg4M7jP9zzlnCRVJVfoJ20LAmxR3XgvTo7km6tNBU1HihQn8Bhkhpzh4uT4URydgthctJSfC1nbd0QOHsPtu8YbRdQcQGecZAdVAQ1zkPNrzRQHkP31LBNewmaSx1sAn4NNtnAAWqSWnk1HzvwZDZD' },
            method: 'GET'
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Parse the JSON returned from FB
                body = JSON.parse(body);
                // Save profile to userData
                session.dialogData.firstname = body.first_name;
                session.dialogData.lastname = body.last_name;
                session.dialogData.profilepic = body.profile_pic;
                session.dialogData.locale = body.locale;
                session.dialogData.timezone = body.timezone;
                session.dialogData.gender = body.gender;

                console.log("Last Name " + body.last_name);
                console.log("First Name " + body.first_name);
                console.log("Gender " + body.gender);
                console.log("Locale " + body.locale);

                // Return to /startSession
                session.endDialogWithResult({ response: session.dialogData });
            } else {
                // TODO: Handle errors
                console.log(error);
                console.log("Get user profile failed");
            }
        }
		);
}

function accountlinking(apireq,usersession)
{
	console.log('Account Linking Button') ;
	var respobj ={"facebook":{"attachment":{"type":"template","payload":{"template_type":"generic","elements":[{"title":"Login to Verizon","image_url":"https://www.verizon.com/cs/groups/public/documents/adacct/vzlogo_lg.png","buttons":[{"type":"account_link","url":"https://www98.verizon.com/foryourhome/myaccount/ngen/upr/bots/preauth.aspx"}]}]}}}};
	var msg = new builder.Message(usersession).sourceEvent(respobj);              
         usersession.send(msg);
}

// function calls
function welcomeMsg(usersession)
{
     console.log("inside welcomeMsg");
       var respobj= {"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":"Want to know what’s on tonight? When your favorite sports team is playing? What time your favorite show is coming on? I can answer almost anything, so try me! Before we get started—let’s take a few minutes to get me linked to your Verizon account, this way I can send you personalized recommendations, alerts.","buttons":[{"type":"postback","title":"Link Account","payload":"Link Account"},{"type":"postback","title":"Maybe later","payload":"Main Menu"}]}}}};
	 console.log(JSON.stringify(respobj)); 
	usersession.send("Hi Welcome to Verizon");
	var msg = new builder.Message(usersession).sourceEvent(respobj);              
          usersession.send(msg);
}

function MainMenu(usersession)
{
   // var respobj = {"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":"Are you looking for something to watch, or do you want to see more options? Type or tap below.","buttons":[{"type":"postback","title":"What's on tonight?","payload":"On Later"},{"type":"postback","title":"More Options","payload":"More Options"}]}}}};
     var respobj ={"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":"Are you looking for something to watch, or do you want to see more options? Type or tap below.","buttons":[{"type":"postback","title":"What's on tonight?","payload":"On Later"},{"type":"postback","title":"Show Program Categories","payload":"Show Program Categories"},{"type":"postback","title":"More Options","payload":"More Options"}]}}}};
     var msg = new builder.Message(usersession).sourceEvent(respobj);              
     usersession.send(msg);
}

 function CategoryList(apireq,usersession) {
	
	var pgNo = apireq.result.parameters.PageNo;
	var categlist={}
	
	switch(pgNo)
	{
		case '1':
			categlist={"facebook":
			{ "text":"Pick a category", 
			 "quick_replies":[ 
			//    "content_type":"text", "title":"Red", "payload":"red"
			    { "content_type": "text", "title":"Children & Family", "payload":"show Kids movies" }, 
			    { "content_type": "text", "title":"Action & Adventure", "payload":"show Action movies" }, 
			    { "content_type": "text", "title":"Documentary", "payload":"show Documentary movies" }, 
			    { "content_type": "text", "title":"Mystery", "payload":"show Mystery movies" },
			    { "content_type": "text", "title":"More Categories ", "payload":"show categories list pageno: 2" }
			 ] }};
			break;
		default :
		categlist={"facebook":
			{ "text":"I can also sort my recommendations for you by genre. Type or tap below", 
			 "quick_replies":[ 
			    { "content_type": "text", "payload":"Show Comedy movies", "title":"Comedy" }, 
			    { "content_type": "text", "payload":"Show Drama movies", "title":"Drama" }, 
			    { "content_type": "text", "payload":"Show Sports program" , "title":"Sports"}, 
			    { "content_type": "text", "payload":"show Sci-Fi movies" , "title":"Sci-Fi"},
			    { "content_type": "text", "payload":"show categories list pageno: 1" , "title":"More Categories "}
			 ] }};
			break;
		}
	
	var msg = new builder.Message(usersession).sourceEvent(categlist);              
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
	
	//usersession.send("I found several related programs");
	var msg = new builder.Message(usersession).sourceEvent(subflow);              
        usersession.send(msg);
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
} 

function recommendations(pgmtype,callback) { 
       	console.log('inside external call ');
        var headersInfo = { "Content-Type": "application/json" };
	var args = {
		"headers": headersInfo,
		"json": {
			Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
			Request: {
				ThisValue: pgmtype, BotstrVCN:''
			}
		}
	};

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
  
function recommendationsCallback(apiresp,usersession) {
    var objToJson = {};
    objToJson = apiresp;
	var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
	
	 console.log("subflow " + JSON.stringify(subflow));
	
	var msg = new builder.Message(usersession).sourceEvent(subflow);              
        usersession.send(msg);
} 

function LinkOptions(apireq,usersession)
{
    console.log('Calling from  link options:') ;
	
    var strRegionId =  apireq.result.parameters.RegionId;
    console.log('strRegionId:' + strRegionId) ;
	var respobj={};
	if (strRegionId != undefined  && strRegionId !='')
	{
		respobj= {"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":"Are you looking for something to watch, or do you want to see more options? Type or tap below.","buttons":[{"type":"postback","title":"What's on tonight?","payload":"On Later"},{"type":"postback","title":"More Options","payload":"More Options"}]}}}};
	}
	else
	{
		var struserid = ''; 
		for (var i = 0, len = apireq.result.contexts.length; i < len; i++) 
		{
				if (apireq.result.contexts[i].name == "sessionuserid")
				{
					 struserid = apireq.result.contexts[i].parameters.Userid;
					console.log("original userid " + ": " + struserid);
				}
		} 

		if (struserid == '' || struserid == undefined) struserid='lt6sth2'; //hardcoding if its empty	

		respobj= {"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":"Congrats, we got your details. Tap Continue to proceed.","buttons":[{"type":"postback","title":"Continue","payload":"Userid : " + struserid + "   Regionid : 92377"}]}}}};
	}

    var msg = new builder.Message(usersession).sourceEvent(respobj);              
    usersession.send(msg);
}

function RecordScenario (apiresp,usersession)
{
	console.log("inside RecordScenario");
	var channel = apiresp.result.parameters.Channel.toUpperCase();
	var program = apiresp.result.parameters.Programs.toUpperCase();
	var time = apiresp.result.parameters.timeofpgm;
	var dateofrecord = apiresp.result.parameters.date;
	var SelectedSTB = apiresp.result.parameters.SelectedSTB;
	console.log("SelectedSTB : " + SelectedSTB + " channel : " + channel + " dateofrecord :" + dateofrecord + " time :" + time);
		
		if (time == "") //if time is empty show schedule
			{ PgmSearch(apiresp,function (str){ PgmSearchCallback(str,usersession)});}
		else if (SelectedSTB == "" || SelectedSTB == undefined) 
			{ STBList(apiresp,function (str){ STBListCallBack(str,usersession)}); }
		else if (channel == 'HBO') //not subscribed scenario - call to be made
			{
			  var respobj = {"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":" Sorry you are not subscribed to " + channel +". Would you like to subscribe " + channel + " ?","buttons":[{"type":"postback","title":"Subscribe","payload":"Subscribe"},{"type":"postback","title":"No, I'll do it later ","payload":"Main Menu"}]}}}};	
			  var msg = new builder.Message(usersession).sourceEvent(respobj);              
			  usersession.send(msg);
			}
		else if (channel == 'CBS')  //DVR full scenario - call to be made
			{
			   var respobj= {"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":" Sorry your DVR storage is full.  Would you like to upgrade your DVR ?","buttons":[{"type":"postback","title":"Upgrade my DVR","payload":"Upgrade my DVR"},{"type":"postback","title":"No, I'll do it later ","payload":"Main Menu"}]}}}};
			   var msg = new builder.Message(usersession).sourceEvent(respobj);              
			   usersession.send(msg);
			}
		else 
			{  //Schedule Recording
			   console.log(" Channel: " + apiresp.result.parameters.Channel +" Programs: " + apiresp.result.parameters.Programs +" SelectedSTB: " + apiresp.result.parameters.SelectedSTB +" Duration: " + apiresp.result.parameters.Duration +" FiosId: " + apiresp.result.parameters.FiosId +" RegionId: " + apiresp.result.parameters.RegionId +" STBModel: " + apiresp.result.parameters.STBModel +" StationId: " + apiresp.result.parameters.StationId +" date: " + apiresp.result.parameters.date +" timeofpgm: " + apiresp.result.parameters.timeofpgm );
			   DVRRecord(apiresp,function (str){ DVRRecordCallback(str,usersession)});
			}  
}


function STBList(apireq,callback) { 
       	console.log('inside external call '+ apireq.contexts);
	var struserid = ''; 
	for (var i = 0, len = apireq.result.contexts.length; i < len; i++) {
		if (apireq.result.contexts[i].name == "sessionuserid") {

			 struserid = apireq.result.contexts[i].parameters.Userid;
			console.log("original userid " + ": " + struserid);
		}
	} 
	
	if (struserid == '' || struserid == undefined) struserid='lt6sth2'; //hardcoding if its empty
	
		console.log('struserid '+ struserid);
        var headersInfo = { "Content-Type": "application/json" };
	var args = {
		"headers": headersInfo,
		"json": {Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
			 Request: {ThisValue: 'STBList',Userid:struserid} 
			}
		
	};

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
  
function STBListCallBack(apiresp,usersession) {
    var objToJson = {};
    objToJson = apiresp;
	var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
   	var msg = new builder.Message(usersession).sourceEvent(subflow);              
    	usersession.send(msg);
} 

function DVRRecord(apireq,callback) { 
	
	var strUserid = ''; 
	for (var i = 0, len = apireq.result.contexts.length; i < len; i++) {
		if (apireq.result.contexts[i].name == "sessionuserid") {

			 strUserid = apireq.result.contexts[i].parameters.Userid;
			console.log("original userid " + ": " + strUserid);
		}
	} 
	if (strUserid == '' || strUserid == undefined) strUserid='lt6sth2'; //hardcoding if its empty
		
         var strProgram =  apireq.result.parameters.Programs;
	 var strChannelName =  apireq.result.parameters.Channel;
	 var strGenre =  apireq.result.parameters.Genre;

	var strFiosId = apireq.result.parameters.FiosId;
	var strStationId =apireq.result.parameters.StationId  ;
	
	var strAirDate =apireq.result.parameters.date  ;
	var strAirTime =apireq.result.parameters.timeofpgm  ;
	var strDuration =apireq.result.parameters.Duration  ;
	
	var strRegionId =apireq.result.parameters.RegionId;
	var strSTBModel =apireq.result.parameters.STBModel  ;
	var strSTBId =apireq.result.parameters.SelectedSTB  ;
	
	var strVhoId =apireq.result.parameters.VhoId  ;
	var strProviderId =apireq.result.parameters.ProviderId  ;
	
	
	 console.log(" strUserid " + strUserid + "Recording strProgram " + strProgram + " strGenre " + strGenre + " strdate " +strAirDate + " strFiosId " +strFiosId + " strStationId " +strStationId  +" strAirDate " + strAirDate + " strAirTime " + strAirTime+ " strSTBId " +strSTBId + " strSTBModel " +strSTBModel+" strRegionId " +strRegionId+ " strDuration " +strDuration );
	
        var headersInfo = { "Content-Type": "application/json" };
	
	var args = {
		"headers": headersInfo,
		"json": {Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
			 Request: {ThisValue: 'DVRSchedule', 
				   Userid : strUserid,
				   BotStbId:strSTBId, 
				   BotDeviceModel : strSTBModel,
				   BotstrFIOSRegionID : '91629',
				   BotstrFIOSServiceId : strFiosId,
				   BotStationId : strStationId,
				   BotAirDate : strAirDate,
				   BotAirTime : strAirTime,
				   BotDuration : strDuration,
				   BotVhoId : strVhoId,
				   BotProviderId : strProviderId
				   } 
			}
		};
	
	 console.log("args " + JSON.stringify(args));
	
    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
             
                 console.log("body " + JSON.stringify(body));
                callback(body);
            }
            else
            	console.log('error: ' + error + ' body: ' + body);
        }
    );
 } 

function DVRRecordCallback(apiresp,usersession) 
{
     var objToJson = {};
     objToJson = apiresp;
	try{
		var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
		console.log(JSON.stringify(subflow));
		var respobj={};
		if (subflow !=null )
		{
			if (subflow.facebook.result.msg =="success" )
			{
				respobj = {"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":"Your recording has been scheduled. Would you like to see some other TV Recommendations for tonight?","buttons":[{"type":"postback","title":"Show Recommendations","payload":"Show Recommendations"},{"type":"postback","title":"More Options","payload":"More Options"}]}}}};
				var msg = new builder.Message(usersession).sourceEvent(respobj);              
				usersession.send(msg);
			}
			else
			{
				var msg = "Sorry!, There is a problem occured in Scheduling( "+ subflow.facebook.result.msg + " ). Try some other.";
				usersession.send(msg);
			}
		}
		else
		{
			var msg = "Sorry!, There is a problem occured in Scheduling. Try some other.";
			usersession.send(msg);
		}
	}
	catch (err) 
	{
		console.log( "Error occured in recording: " + err);
		var msg = "Sorry!, There is a problem occured in Scheduling. Try some other.";
		usersession.send(msg);
	}
}



function demowhatshot(usersession) 
{
    var respobj =  {"facebook":{"attachment":{"type":"template","payload":{"template_type":"generic","elements":[{"title":"Family Guy","subtitle":"WBIN : Comedy","image_url":"http://image.vam.synacor.com.edgesuite.net/8d/53/8d532ad0e94c271f8fb153a86141de2c92ee15b0/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Family Guy Channel: WBIN"}]},{"title":"NCIS","subtitle":"USA : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/85/ed/85ed791472df3065ae5462d42560773a649fdfaf/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: NCIS Channel: USA"}]},{"title":"Shark Tank","subtitle":"CNBC : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/0f/07/0f07592094a2a596d2f6646271e9cb0311508415/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Shark Tank Channel: CNBC"}]},{"title":"Notorious","subtitle":"ABC WCVB : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/ba/51/ba51ba91eafe2da2a01791589bca98c0044b6622/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Notorious Channel: ABC WCVB"}]},{"title":"Chicago Med","subtitle":"NBC WHDH : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/e1/93/e1933b6aee82a467980415c36dced6fddf64d80a/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Chicago Med Channel: NBC WHDH"}]},{"title":"Modern Family","subtitle":"CW WLVI : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/c1/58/c1586d0e69ca53c32ae64526da7793b8ec962678/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Modern Family Channel: CW WLVI"}]}]}}}};
    var msg = new builder.Message(usersession).sourceEvent(respobj);              
    usersession.send(msg);
}

function testmethod(usersession)
{
 	console.log("inside test method");
	var myobj=  {   "facebook": {
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
				}
			  	}
		    };
	
	  var msg = new builder.Message(usersession).sourceEvent(myobj);              
           usersession.send(msg);
}
