
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

// New =============
//=========================================================
// Bots Global Actions
//=========================================================
bot.endConversationAction('goodbye', 'Goodbye ,Have a greatday ', { matches: /^goodbye/i});


//=========================================================
// Bots Dialogs
//=========================================================
bot.dialog('/', [    function (session)
                 {   
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
                     session.beginDialog('/startsession');
                 }
                 /*,    function (session, results)
                 {       
                 // Display menu        
                 session.beginDialog('/menu'); 
                 },   
                 function (session, results) 
                 {      
                 // Always say goodbye      
                 session.send("Ok... See you later!");    }*/
                ]);

bot.dialog('/menu',
           [    function (session) 
            {       
                builder.Prompts.choice(session, "What demo would you like to run?", "prompts|picture|cards|list|carousel|receipt|actions|(quit)");
            },  
            function (session, results) 
            {       
                if (results.response && results.response.entity != '(quit)') 
                {        
                    // Launch demo dialog       
                    session.beginDialog('/' + results.response.entity);  
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
                                 request.on('response', function (response)    
                                            {            
                                     var intent = response.result.action; 
                                     console.log(JSON.stringify(response)); 
                                     session.send(response.result.fulfillment.speech); 
                                     var msg = new builder.Message(session).sourceEvent(  
                                         {                  
                                             facebook: response.result.fulfillment.data.facebook.attachment  
                                         });              
                                     console.log(JSON.stringify(msg));      
                                     session.send(msg);             
                                 });                
                                 request.on('error', function (error)    
                                            {      
                                     console.log(error);         
                                 });             
                                 request.end();    
                             }]);
