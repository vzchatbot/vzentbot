// record.js
var Record = function () { };

Record.prototype.doRecord = function (session, response, builder) {    
                                         console.log("----------record.js:SELECTED INTENT IS recordnew----------");
                                         console.log("inside startsession");                                   
                                         session.send(response.result.fulfillment.source);
                                         console.log(response.result.contexts.name);
                                         /*var msg = new builder.Message(session).sourceEvent(
                                             {
                                               "facebook": {
                                                "attachment": {
                                                    "type": "template",
                                                    "payload": {
                                                        "template_type": "button",
                                                        "text": "Hey , welcome to Verizon! Want to know what’s on tonight?  I can answer almost anything, so try me! Also, if you want personalized alerts through Messenger link me to your Verizon account! ",
                                                        "buttons": [
                                                            {
                                                                "type": "postback",
                                                                "title": "Link Account",
                                                                "payload": "Link Account"
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                             });  
                                    session.send(msg);
                                    */
}
exports.Record = new Record();
