var restify = require('restify');
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

//=========================================================
// Bots Global Actions
//=========================================================

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session) {
        
        console.log("=== DIALOG: GETSTARTED | STEP: 1/4 ====");

        //console.log(session.userData);
        // Let the user know we are 'working'
        //session.sendTyping();
        //if( !session.userData.firstRun ) {
            // Store the returned user page-scoped id (USER_ID) and page id
            session.userData.userid = session.message.sourceEvent.sender.id;
            session.userData.pageid = session.message.sourceEvent.recipient.id;

            // DELAY ISN'T THE REQUEST - I THINK IT'S THE INITIAL REQUEST TO BOTFRAMEWORK

            // Move to the /getprofile dialog
            session.beginDialog('/getprofile');
        //} else {
            // The firstname has been stored so the user has completed the /getstarted dialog
            // Stop this dialog and Welcome them back
          //  session.send('Welcome back');
        //}
    }
]);

// Get users profile
bot.dialog('/getprofile', [
    function (session) {
        console.log("=== DIALOG: GETPROFILE | STEP: 1/1 ====");
        //console.log(session);
        // Store the returned user page-scoped id (USER_ID) and page id
        session.userData.userid = session.message.sourceEvent.sender.id;
        session.userData.pageid = session.message.sourceEvent.recipient.id;
        
        console.log(session.userData.userid);
        console.log(session.userData.pageid);

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
                //session.dialogData.hometown = body.hometown;
                //session.dialogData.location = body.location;
                // Return to /getstarted
           
                console.log("Gender " + body.gender);
                console.log("Locale " + body.locale);
                console.log("Last Name " + body.last_name);
                console.log("First Name " + body.first_name);
                //console.log("Location " + body.hometown);
                //console.log("Email " + body.email);
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
                  

  
  //              console.log("inside startsession");
    //            var request = app.textRequest(session.message.text, options);   
      //          request.on('response', function (response) 
        //        {        
                   /* var intent = response.result.action;
                    //console.log(JSON.stringify(response));     
                    session.send(response.result.fulfillment.speech);   
                    console.log(response.result.fulfillment.data);
                    console.log(response.result.fulfillment.data.facebook.attachment);
                    
                    var msg = new builder.Message(session).sourceEvent(
                    {
                        facebook: response.result.fulfillment.data.facebook.attachment
                    });
                    //console.log(msg); 
                    
                    session.send(msg);   */
                    
                    //var actualFBMessage={"attachment":{"type":"template","payload":{"template_type":"generic","elements":[{"title":"Login to Verizon","image_url":"https://www.verizon.com/cs/groups/public/documents/adacct/vzlogo_lg.png","buttons":[{"type":"account_link","url":"https://www98.verizon.com/foryourhome/myaccount/ngen/upr/bots/preauth.html"}]}]}}};
                    //var datResponse={"speech":"Sign in ","data":{"facebook": actualFBMessage},"contextOut":[{"name":"sigin", "lifespan":2, "parameters":{"type":"signin"}}],"source":"apiaiwebhook"};
                    //session.send(datResponse);
          //      });  
            //    request.on('error', function (error)
              //  {
                //   console.log(error);  
                //}); 
               // request.end();
           }
]);
