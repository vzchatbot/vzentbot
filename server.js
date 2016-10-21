var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('apiai');
var app = apiai("db847b425ad44ca38e2d696d8b0750cd");
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

bot.beginDialog('/startsession');
bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/startsession', [
    function (session) {
        
        console.log("=== DIALOG: New Session Started ====");
        
        if( !session.userData.firstRun ) {
            // Store the returned user page-scoped id (USER_ID) and page id
            session.userData.userid = session.message.sourceEvent.sender.id;
            session.userData.pageid = session.message.sourceEvent.recipient.id;

            // DELAY ISN'T THE REQUEST - I THINK IT'S THE INITIAL REQUEST TO BOTFRAMEWORK
            // Move to the /getprofile dialog
            session.beginDialog('/getprofile');
            session.replaceDialog('/afterprofilecall');
            
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

bot.dialog('/afterprofilecall', [
    function (session)
           { 
                var options =
                {
                    sessionId: '94642ab5-31b3-4eac-aa1f-d4ef57284007'
                } 
                console.log("Start getting information from API.AI after profile call");
                var request = app.textRequest(session.message.text, options);   
                request.on('response', function (response) 
                {        
                    var intent = response.result.action;
                    //console.log(JSON.stringify(response));     
                    session.send(response.result.fulfillment.speech);   

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

                request.end();
           
           } // end of function declaration
]); // End of dialoag function
