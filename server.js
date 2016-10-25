var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('apiai');
//var app = apiai("901c05fa26b7415196db699acdc5d193"); // Prabu
var app = apiai("db847b425ad44ca38e2d696d8b0750cd"); // Mine
var request = require('request');

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
// Bots Global Actions
//=========================================================

//bot.beginDialog('/startsession');
bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });

//=========================================================
// Bots Dialogs
//=========================================================
server.get('/test', function (req, res) {
	console.log("botwebook ");
});
	    
bot.dialog('/', [
    function (session) {
        
        console.log("=== DIALOG: New Session Started ====");
        console.log("Session Info " + session.message);
        
        if( !session.userData.firstRun ) {
            // Store the returned user page-scoped id (USER_ID) and page id
            session.userData.userid = session.message.sourceEvent.sender.id;
            session.userData.pageid = session.message.sourceEvent.recipient.id;

            // DELAY ISN'T THE REQUEST - I THINK IT'S THE INITIAL REQUEST TO BOTFRAMEWORK
            // Move to the /getprofile dialog
            //session.beginDialog('/getprofile');
            session.beginDialog('/startsession');
            //messageEvents(req,res);
        } else {
            // The firstname has been stored so the user has completed the /getstarted dialog
            // Stop this dialog and Welcome them back
            console.log("Welcome Back User");
            console.log("Gender " + session.dialogData.gender);
            console.log("Locale " + session.dialogData.locale);
            console.log("Last Name " + session.dialogData.lastname);
            console.log("First Name " + session.dialogData.firstname);
            session.send('Welcome back');
        }
    }
]);

// Get facebook users profile
bot.dialog('/getprofile', [
    function (session) {
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
            url: 'https://graph.facebook.com/v2.8/'+ session.userData.userid +'?fields=first_name,last_name,profile_pic,locale,timezone,gender',
            qs: { access_token: 'EAAZA7BXIxv6IBAF0ce1LuQUZBqepPjBbTnFYcQ9jBITFpFEtoGi3H2kAcBAvT1eTV3BNERepLnpQzexlyIFEmvMrZCBOaROeJgBIlkcGCxwkVtDF92o5ZAvMbBm09ObPxO5opABmcZAZCdD3sp4WwUzh08JU5ZApiQXVBUQWoQhqQZDZD' },
            method: 'GET'
        }, function(error, response, body) {
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
        });
    }
]);

bot.dialog('/startsession', [
    function (session)
           { 
                var options =
                {
                    sessionId: '94642ab5-31b3-4eac-aa1f-d4ef57284007'
                } 
		console.log("Full Session ", session);
		console.log("Account Linking " + session.message.sourceEvent.account_linking);
		console.log("Account Linking: %j" + session.message.sourceEvent.account_linking); 
		console.log("Account Linking convert: " + JSON.stringify(session.message.sourceEvent.account_linking,null,2)); 
                console.log("Start getting information from API.AI after profile call");
                console.log("Message Text "+ session.message.text);
                var request = app.textRequest(session.message.text, options);   
               
                request.on('response', function (response) 
                {        
                    var intent = response.result.action;
                    console.log("Action " + intent);     
                    //session.send(response.result.fulfillment.speech);  
                    console.log(" TEXT1 :" + JSON.stringify(response.result.fulfillment.data.facebook.attachment.payload.text));
	            console.log(" Attachment value :" + JSON.stringify(response.result.fulfillment.data)); 
                   
		    var msg = new builder.Message(session).sourceEvent(
                    {
                        facebook: response.result.fulfillment.data.facebook
                    });
		   
		   session.send(msg);	
			
                });  
                request.on('error', function (error)
                {
                    console.log(error);  
                }); 

               // session.replaceDialog('/accountlink');
                request.end();
           
           } // end of function declaration
]); // End of dialoag function

bot.dialog('/accountlink', [
    function (session) {
        console.log("Account Linking function");
        
        var msg = new builder.Message(session)

            .sourceEvent({

                facebook: {

                    attachment: {

                        type: "template",

                        payload: {

                            template_type: "button",

                            text: "Welcome, Link your Verizon Account",
                            
                            buttons:[{
                                    type: "account_link",
                                    url: "https://www98.verizon.com/foryourhome/myaccount/ngen/upr/bots/preauth.aspx"
                            }],

                        } //Payload

                    } // attachment

                } // facebook

            }); // sourcevent

        session.send(msg);
        session.endDialog();
           } // end of function declaration
]); // End of dialoag function account link
        
function messageEvents(req, res){
     console.log("MessegeEvent Function");
   var data = req.body;
  // Make sure this is a page subscription
  
  if (data.object == 'page') {
  
    // Iterate over each entry
    // There may be multiple if batched

    data.entry.forEach(function(pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;

      // Iterate over each messaging event

      pageEntry.messaging.forEach(function(messagingEvent) {

        if (messagingEvent.optin) {
          receivedAuthentication(messagingEvent);
	      console.log("Webhook received following messagingEvent optin");
        } else if (messagingEvent.message) {
          //receivedMessage(messagingEvent);
	      console.log("Webhook received following messagingEvent message");
        } else if (messagingEvent.delivery) {
          //receivedDeliveryConfirmation(messagingEvent);
	       console.log("Webhook received following messagingEvent delivery");
        } else if (messagingEvent.postback) {
          //receivedPostback(messagingEvent);
	      console.log("Webhook received following messagingEvent postback");
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }

      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've 
    // successfully received the callback. Otherwise, the request will time out.

    res.sendStatus(200);

  } // if loop
} //close of function


function receivedAuthentication(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfAuth = event.timestamp;

  // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
  // The developer can set this to an arbitrary value to associate the 
  // authentication callback with the 'Send to Messenger' click event. This is
  // a way to do account linking when the user clicks the 'Send to Messenger' 
  // plugin.
  var passThroughParam = event.optin.ref;

  console.log("Received authentication for user %d and page %d with pass " +
    "through param '%s' at %d", senderID, recipientID, passThroughParam, 
    timeOfAuth);

  // When an authentication is received, we'll send a message back to the sender
  // to let them know it was successful.
  console.log("FB and Verizon Link successful");
}
