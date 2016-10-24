
var builder = require('botbuilder');
var apiai = require('apiai');
var app = apiai("901c05fa26b7415196db699acdc5d193");

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


/*app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var router = express.Router(); 

var headersInfo = { "Content-Type": "application/json" };
var Client = require('node-rest-client').Client;
var client = new Client();
var args = {
    "headers": headersInfo
};*/

//===============================
/*bot.dialog('/menu',
           [    function (session) 
            {       
                builder.Prompts.choice(session, "What would you like to run?", "picture|cards|actions|(quit)");
                console.log( "in menu"+ result.response.entity)
            },  
            function (session, results) 
            {       
                if (results.response && results.response.entity != '(quit)') 
                {  
                    session.beginDialog('/' + results.response.entity);  
                    console.log( "in quit"+ result.response.entity)
                } 
                else
                {      
                    // Exit the menu     
                    session.endDialog(); 
                }  
            },  
            function (session, results)
            {     
                // The menu runs a loop until the user chooses to (quit).  
                session.replaceDialog('/menu'); 
            }]).reloadAction('reloadMenu', null, { matches: /^menu|show menu/i });
	    */
//================================

router.post('/', function (session) {
//  var action = req.body.result.action;
	var action ="getStarted";
  
	
    switch (action) {
        case "welcome":
            // res.json(chatInitiate());
             res.json(secondMsg(req));
       //  res.json(welcomeInit());
            break;
        case "CategoryList":
           res.json(CategoryList(req));
	    break;
        case "getStarted":
           res.json(welcomeMsg());
        break;
    	case "LinkOptions":
             res.json(LinkOptionsNew(req));
            break;
        case "MoreOptions":
             res.json(MoreOptions());
            break;
        case "Billing":
           STBList(req,function (str) {res.json(STBListCallBack(str));  }); 
            break;
        case "record":
           res.json(record(req));
            break;
	 case "stblist":
           getstblist(req,function (subflow){res.json(subflow);});
            break;
        case "upsell":
            res.json(upsell(req));
            break;
        case "upgradeDVR":
            res.json(upgradeDVR(req));
            break;
         case "MainMenu":
            res.json(MainMenu());
            break;
	case "Trending":
            recommendTVNew('Trending',function (str) {res.json(recommendTVNew1(str));  }); 
            break;
        case "recommendation":
            //recommendTVNew('whatshot',function (str) {res.json(recommendTVNew1(str));  }); 
	        res.json(demowhatshot());
		break;
	case "channelsearch":
            ChnlSearch(req,function (str) {res.json(ChnlSearchCallback(str));  }); 
            break; 
	case "programSearchdummy":
	    res.json(programSearch(req));
            break;
	case "programSearch":
              PgmSearch(req,function (str) {res.json(PgmSearchCallback(str));  }); 
            break; 
	case "recordnew":
              	var channel = req.body.result.parameters.Channel.toUpperCase();
		var program = req.body.result.parameters.Programs.toUpperCase();
		var time = req.body.result.parameters.timeofpgm;
		var dateofrecord = req.body.result.parameters.date;
		var SelectedSTB = req.body.result.parameters.SelectedSTB;
		console.log("SelectedSTB : " + SelectedSTB + " channel : " + channel + " dateofrecord :" + dateofrecord + " time :" + time);
		if (time == "") {PgmSearch(req, function (str) { res.json(PgmSearchCallback(str)); });}
		else if (SelectedSTB == "" || SelectedSTB == undefined) {getstblist(req, function (subflow) { res.json(subflow); });}
		else if (channel == 'HBO') //not subscribed case
		{
		res.json ({
			speech: " Sorry you are not subscribed to " + channel +". Would you like to subscribe " + channel + "?",
			displayText: "Subscribe",
			data: {
			    "facebook": {
				"attachment": {
				    "type": "template",
				    "payload": {
					"template_type": "button",
					"text": " Sorry you are not subscribed to " + channel +". Would you like to subscribe " + channel + "?",
					"buttons": [
					    {
						"type": "postback",
						"title": "Subscribe",
						"payload": "Subscribe"
					    },
					    {
						"type": "postback",
						"title": "No, I'll do it later ",
						"payload": "Main Menu"
					    }
					]
				    }
				}
			    }
			},
			source: "Zero Service - app_zero.js"
		    });	

		}
		else if (channel == 'CBS')  //DVR full case
		{
		res.json ({
			speech: " Sorry your DVR storage is full.  Would you like to upgrade your DVR ?",
			displayText: "Subscribe",
			data: {
			    "facebook": {
				"attachment": {
				    "type": "template",
				    "payload": {
                        "template_type": "button",
                        "text": " Sorry your DVR storage is full.  Would you like to upgrade your DVR ?",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Upgrade my DVR",
                                "payload": "Upgrade my DVR"
                            },
                            {
                                "type": "postback",
                                "title": "No, I'll do it later ",
                                "payload": "Main Menu"
                          	  }
                      		  ]
				 }
				}
			    }
			},
			source: "Zero Service - app_zero.js"
		    });	

		}
		else {
				
			console.log(" Channel: " + req.body.result.parameters.Channel +" Programs: " + req.body.result.parameters.Programs +" SelectedSTB: " + req.body.result.parameters.SelectedSTB +" Duration: " + req.body.result.parameters.Duration +" FiosId: " + req.body.result.parameters.FiosId +" RegionId: " + req.body.result.parameters.RegionId +" STBModel: " + req.body.result.parameters.STBModel +" StationId: " + req.body.result.parameters.StationId +" date: " + req.body.result.parameters.date +" timeofpgm: " + req.body.result.parameters.timeofpgm );
			DVRRecord(req, function (str) { res.json(DVRRecordCallback(str)); });
			/*
			var respstr = 'Your recording for "' + req.body.result.parameters.Programs +  '"  on ' + req.body.result.parameters.Channel  +' channel, has been scheduled at ' + req.body.result.parameters.timeofpgm + ' on ' + req.body.result.parameters.SelectedSTB + ' STB.';
				res.json({
				speech: respstr + " Would you like to see some other TV Recommendations for tonight?",
				displayText: "TV Recommendations",
				data: {
					"facebook": {
					"attachment": {
					"type": "template",
					"payload": {
					"template_type": "button",
					"text": respstr + " Would you like to see some other TV Recommendations for tonight?",
					"buttons": [
					{
					"type": "postback",
					"title": "Show Recommendations",
					"payload": "Show Recommendations"
					},
					{
					"type": "postback",
					"title": "More Options",
					"payload": "More Options"
					}]}}}
				},
				source: "Verizon.js"
				});*/
		}  
  
            break; 
        default:
            res.json(recommendTV());
    }
});
function welcomeMsg()
{  
    return (
        {
        speech: "Want to know what’s on tonight? When your favorite sports team is playing? What time your favorite show is coming on? I can answer almost anything, so try me! Before we get started—let’s take a few minutes to get me linked to your Verizon account, this way I can send you personalized recommendations, alerts and notifications through messenger whenever you want. OR if you’re in a hurry send me your zip code/ VZID so that I can send you TV recommendations right away. Don’t worry – your personal information will not be shared with Facebook!",
        displayText: "Link Account",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        //"text": "Hey , welcome to Verizon! Want to know what’s on tonight?  I can answer almost anything, so try me! Also, if you want personalized alerts through Messenger link me to your Verizon account! ",
                      //  "text" : "Want to know what’s on tonight? When your favorite sports team is playing? What time your favorite show is coming on? I can answer almost anything, so try me! Before we get started—let’s take a few minutes to get me linked to your Verizon account, this way I can send you personalized recommendations, alerts and notifications through messenger whenever you want. OR if you’re in a hurry send me your zip code/ VZID so that I can send you TV recommendations right away. Don’t worry – your personal information will not be shared with Facebook!",
			"text" :"Want to know what’s on tonight? When your favorite sports team is playing? What time your favorite show is coming on? I can answer almost anything, so try me! Before we get started—let’s take a few minutes to get me linked to your Verizon account, this way I can send you personalized recommendations, alerts.",
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
        },
        source: "Verizon.js"
      }
      );	
	
}
//=========================================================
// Bots Global Actions
//=========================================================
bot.endConversationAction('goodbye', 'Goodbye ,Have a greatday ', { matches: /^goodbye|bye|close/i });

//=========================================================
// Bots Dialogs
//=========================================================
bot.dialog('/CallHook', [    function (session)
                 {   
                  //  console.log( "sender ID : " + session.message.sourceEvent.sender.id);
                  //   console.log( "recipient ID : " + session.message.sourceEvent.recipient.id);
                  //  console.log("Page ID" + session.message.sourceEvent.recipient.id);
                
                      //console.log("Strat chat");
                     // Send a greeting and show help.  
                     var card = new builder.HeroCard(session)            
                     .title("Ask Verizon")            
                     .text("Your bots - wherever your users are talking.")            
                     .images([                
                     builder.CardImage.create(session, "http://www.verizon.com/cs/groups/public/documents/adacct/vzlogo_lg.png")         
                     ]);  
                     var msg = new builder.Message(session).attachments([card]); 
                     session.send(msg);     
                     console.log("hi"); 
                    // console.log("msg :" + JSON.stringify(msg));
                     session.beginDialog('/startsession'); 
                    // session.beginDialog('/menu');
                 }
                ,    function (session, results)
                 {       
                 // Display menu        
                 session.beginDialog('/menu');                       
                 },   
                 function (session, results) 
                 {      
                 // Always say goodbye      
                 session.send("Ok... See you later!");    }
                ]);


//================================
 bot.dialog('/startsession', [    
                function (session)  
                             { 
                                 var options =   {sessionId: '94642ab5-31b3-4eac-aa1f-d4ef57284007'}  
                                                          
                                 var request = app.textRequest(session.message.text, options);
                                 console.log("inside startsession");
                                 request.on('response', function (response)    
                                            { 
                                     var intent = response.result.action;
                                     var text1= response.result.fulfillment.data.facebook.attachment.payload.text;
                                     console.log(" TEXT1 :" + JSON.stringify(response.result.fulfillment.data.facebook.attachment.payload.text));
                                     console.log(" Attachment value :" + JSON.stringify(response.result.fulfillment.data)); 
                                     var text1= response.result.fulfillment.data.facebook.attachment.payload.text;
                                     var speech1=response.result.fulfillment.speech
                                     if (text1 !== "" || text1 !== undefined) //for Text
                                     {
                                   
                                     session.send(response.result.fulfillment.text);
                                     console.log(" Text value :" + JSON.stringify(response.result.fulfillment.data.facebook.attachment.payload.text));
                                     var msg = new builder.Message(session).sourceEvent(  
                                         {                  
                                              facebook: response.result.fulfillment.data.facebook 
                                         });              
                                     session.send(msg);
                                     }
                                     else if (speech1 !== "" || speech1 !== undefined)                                  
                                     {
                                     session.send(response.result.fulfillment.speech); //For speech
                                     console.log("Text values is empty and the speech value is :" + JSON.stringify(response.result.fulfillment.speech));
                                     console.log("Speech Value :" + JSON.stringify(response.result.fulfillment.speech));
                                     var msg1 = new builder.Message(session).sourceEvent(
                                         {                                      
                                          facebook: response.result.fulfillment.data.facebook.attachment.payload 
                                         });
                                     session.send(msg1);                                   
                                     }
                                      else if ((speech1 !== "" || speech1 !== undefined)&&(response.fulfillment.webhookUsed == "true"))                                  
                                     {
                                     session.send(response.result.fulfillment.speech ); //For speech
                                     console.log("Text values is empty and the speech value is :" + JSON.stringify(response.result.fulfillment.speech));
                                     console.log("Speech Value :" + JSON.stringify(response.result.fulfillment.speech));
                                     var msg2 = new builder.Message(session).sourceEvent(
                                         {                                      
                                          facebook: response.result.fulfillment.speech 
                                         });
                                     session.send(msg2);                                   
                                     }
                                     else
                                     {                                       
                                         var card2 = new builder.HeroCard(session)            
                                         .title("Verizon Bot")            
                                         .text("Sorry...I think I may have misunderstood your last statement.")            
                                         .images([                
                                          builder.CardImage.create(session, "http://www.verizon.com/cs/groups/public/documents/adacct/vzlogo_lg.png")         
                                          ]);  
                                         var msg4 = new builder.Message(session).attachments([card2]); 
                                         session.send(msg4);
                                     }
                                 });                
                                 request.on('error', function (error)    
                                            {      
                                     console.log(error);         
                                 });             
                                 request.end();    
                             }]);

               

//===============
