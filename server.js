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
// Bots Dialogs
//=========================================================
bot.dialog('/', function (session)        
           {    
    var options =    
        {     
            sessionId: '9f04e63b-9ca6-4243-95ef-936be5a94g12'   
        }   
    var request = app.textRequest(session.message.text, options);  
    request.on('response', function (response)       
               {    
        var intent = response.result.action;   
        //console.log(JSON.stringify(response));  
        session.send(response.result.fulfillment.speech);  
        var msg = new builder.Message(session).sourceEvent(  
            {        
                facebook: response.result.fulfillment.data.facebook.attachment
            });  
        //console.log(JSON.stringify(msg));  
        session.send(msg);   
    });   
    request.on('error', function (error)   
               {    
        console.log(error);     
    });  
    request.end()});

//=============
// Getting User Profile details (message sender)
//=============

bot.dialog('/getprofile', [
    function (session) {
        console.log("=== DIALOG: GETPROFILE | STEP: 1/1 ====");

        // Store the returned user page-scoped id (USER_ID) and page id
        session.userData.userid = session.message.sourceEvent.sender.id;
        session.userData.pageid = session.message.sourceEvent.recipient.id;

        // Let the user know we are 'working'
        session.sendTyping();
        // Get the users profile information from FB
        request({
            url: 'https://graph.facebook.com/v2.6/'+ session.userData.userid +'?fields=first_name,last_name,profile_pic,locale,timezone,gender',
            qs: { access_token: process.env.FB_PAGE_ACCESS_TOKEN },
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
                // Return to /getstarted
                session.endDialogWithResult({ response: session.dialogData });
            } else {
                // TODO: Handle errors
                console.log(error);
                console.log("Get user profile failed");
            }
        });
    }
]);


