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
                                 var options =   {sessionId: '94642ab5-31b3-4eac-aa1f-d4ef57284007'}  
                                                          
                                 var request = app.textRequest(session.message.text, options);
                                    
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
                                    // else if ((speech1 == "" || speech1 == undefined)&&(text1 == "" || text1 == undefined)) // text and speech empty
                                     else if(response.fulfillment.action =="input.unknown" || response.fulfillment.webhookUsed == "false")
                                     {
                                          var card1 = new builder.HeroCard(session)            
                                         .title("Verizon Bot")            
                                         .text("Sorry...I think I may have misunderstood your last statement.")            
                                         .images([                
                                          builder.CardImage.create(session, "http://www.verizon.com/cs/groups/public/documents/adacct/vzlogo_lg.png")         
                                          ]);  
                                         var msg3 = new builder.Message(session).attachments([card1]); 
                                         session.send(msg3);
                                     }
                                     else
                                     {
                                         console.log("inside startsession");
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
