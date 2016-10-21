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



//===========================
// Typing Indicator
bot.dialog('/countItems', function (session, args) {
    session.sendTyping();
    lookupItemsAsync(args, function (err, items) {
        if (!err) {
            session.send("%d items found", items.length);
        } else {
            session.error(err);
        }
    });
});
//=========================================================
// Bots Global Actions
//=========================================================
bot.endConversationAction('goodbye', 'Goodbye ,Have a greatday ', { matches: /^goodbye|bye|close/i });

// Get profile
//================
bot.dialog('/AL', [
    function (session) {
        
        console.log("=== DIALOG:AL New Session Started ====");
        
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
            qs: { access_token: 'EAAYeV8WAScYBAN9UT9yRYZAg4M7jP9zzlnCRVJVfoJ20LAmxR3XgvTo7km6tNBU1HihQn8Bhkhpzh4uT4URydgthctJSfC1nbd0QOHsPtu8YbRdQcQGecZAdVAQ1zkPNrzRQHkP31LBNewmaSx1sAn4NNtnAAWqSWnk1HzvwZDZD' },
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
               console.log(Message Text + "session.message.text");
                var request = app.textRequest(session.message.text, options);   
               
                request.on('response', function (response) 
                {        
                    var intent = response.result.action;
                    console.log("Action " + intent);     
                    //session.send(response.result.fulfillment.speech);  
                    
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
//=====================
/*
bot.dialog('/picture', [
    function (session) {
        session.send("You can easily send pictures ...");
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: "http://www.theoldrobots.com/images62/Bender-18.JPG"
            }]);
        session.endDialog(msg);
    }
]);
*/

//=========================================================
// Bots Dialogs
//=========================================================
bot.dialog('/', [    function (session)
                 {   
                  //  console.log( "sender ID : " + session.message.sourceEvent.sender.id);
                  //   console.log( "recipient ID : " + session.message.sourceEvent.recipient.id);
                  //  console.log("Page ID" + session.message.sourceEvent.recipient.id);
                
                      //console.log("Strat chat");
                     // Send a greeting and show help.  
                     var card = new builder.HeroCard(session)            
                     .title("Verizon Bot ")            
                     .text("Your bots - wherever your users are talking.")            
                     .images([                
                     builder.CardImage.create(session, "http://www.verizon.com//cs/groups/public/documents/adacct/vzlogo_lg.png")         
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

bot.dialog('/menu',
           [    function (session) 
            {       
                builder.Prompts.choice(session, "What would you like to run?", "picture|cards|actions|(quit)");
                console.log( "in menu"+ result.response.entity)
            },  
            function (session, results) 
            {       
                if (results.response && results.response.entity != '(quit)') 
                {        
                    // Launch demo dialog       
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


                bot.dialog('/startsession', [    
                function (session)  
                             {
                                 var options =   
                                     {
                                         sessionId: '94642ab5-31b3-4eac-aa1f-d4ef57284007'
                                     }  
                                 console.log("inside startsession");
                                 var request = app.textRequest(session.message.text, options);
                               //  console.log(result.fulfilment.data);
                                 request.on('response', function (response)    
                                            {            
                                     var intent = response.result.action; 
                                     console.log(JSON.stringify(response));
                                     console.log(" Attachment :" + JSON.stringify(response.result.fulfillment.data.facebook.attachment.payload.buttons));
                                     session.send(response.result.fulfillment.speech); 
                                     var msg = new builder.Message(session).sourceEvent(  
                                         {                  
                                             facebook: response.result.fulfillment.data.facebook
                                            // facebook: response.result.fulfillment.data.facebook.attachment.payload.buttons 
                                         });              
                                   // console.log(JSON.stringify(msg));      
                                     session.send(msg); 
                                     
                                 });                
                                 request.on('error', function (error)    
                                            {      
                                     console.log(error);         
                                 });             
                                 request.end();    
                             }]);


//===============
