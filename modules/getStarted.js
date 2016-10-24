// getStarted.js
var getStarted = function () { };

getStarted.prototype.dogetStarted = function (session, response, builder) {    
                             
                                     console.log("inside startsession");                                   
                                         session.send(response.result.fulfillment.displayText);
                                         var msg = new builder.Message(session).sourceEvent(
                                             {
                                                 facebook: response.result.fulfillment.data.facebook
                                             
                                                 // facebook: response.result.fulfillment.data.facebook.attachment.payload.buttons 
                                             });  
session.send(msg);
}
exports.getStarted = new getStarted();
