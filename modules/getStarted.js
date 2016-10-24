// getStarted.js
var getStarted = function () { };

getStarted.prototype.dogetStarted = function (req, res) {

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
                                      else if ((speech1 !== "" || speech1 !== undefined)&&(response.fulfillment.webhookUsed== "true"))                                  
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
                                          builder.CardImage.create(session,"http://www.verizon.com/cs/groups/public/documents/adacct/vzlogo_lg.png")         
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
}

exports.getStarted = new getStarted();
