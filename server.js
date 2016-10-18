var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('apiai');
var app = apiai("db847b425ad44ca38e2d696d8b0750cd");

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

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session) {
        // Send a greeting and show help.
        /*var card = new builder.HeroCard(session)
            .title("Microsoft Bot Framework")
            .text("Your bots - wherever your users are talking.")
            .images([
                 builder.CardImage.create(session, "http://docs.botframework.com/images/demo_bot_image.png")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);*/
        console.log("hi");
        session.send("Hi... Welcome to the Verizon, How can we help??");
        session.beginDialog('/startsession');
    }/*,
    function (session, results) {
        // Display menu
        session.beginDialog('/menu');
    },
    function (session, results) {
        // Always say goodbye
        session.send("Ok... See you later!");
    }*/
]);

bot.dialog('/menu', [
    function (session) {
        builder.Prompts.choice(session, "What demo would you like to run?", "prompts|picture|cards|list|carousel|receipt|actions|(quit)");
    },
    function (session, results) {
        if (results.response && results.response.entity != '(quit)') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog();
        }
    },
    function (session, results) {
        // The menu runs a loop until the user chooses to (quit).
        session.replaceDialog('/menu');
    }
]).reloadAction('reloadMenu', null, { matches: /^menu|show menu/i });


bot.dialog('/startsession', [
    function (session)
           { 
                var options =
                    {
                        sessionId: '94642ab5-31b3-4eac-aa1f-d4ef57284007'
                    } 
                console.log("inside startsession");
                var request = app.textRequest(session.message.text, options);   
                request.on('response', function (response) 
                {        
                    var intent = response.result.action;
                    console.log(JSON.stringify(response));     
                    session.send(response.result.fulfillment.speech);   
                    console.log(response.result.fulfillment.data.facebook.attachment);
                    var msg = new builder.Message(session).sourceEvent(
                    {
                        facebook: response.result.fulfillment.data.facebook.attachment
                    });
                    console.log(msg); 
                    
                    session.send(msg);   
                });  
                request.on('error', function (error)
                {
                   console.log(error);  
                }); 
                request.end();
           }
]);
