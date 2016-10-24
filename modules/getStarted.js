// getStarted.js
var getStarted = function () { };

getStarted.prototype.dogetStarted = function (session, response, builder) {    
                             
                                     console.log("inside startsession");                                   
                                         session.send(response.result.fulfillment.speech);
                                         var msg = new builder.Message(session).sourceEvent(
                                             {
                                                 facebook: response.result.fulfillment.data.facebook
                                                 // facebook: response.result.fulfillment.data.facebook.attachment.payload.buttons 
                                             });  

}
exports.getStarted = new getStarted();
