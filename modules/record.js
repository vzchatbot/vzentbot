// record.js
var Record = function () { };

Record.prototype.doRecord = function (session, response, builder) {    
                                         console.log("----------record.js:SELECTED INTENT IS recordnew----------");
                                         console.log("inside startsession");                                   
                                         session.send(response.result.fulfillment.source);
                                         console.log(response.result.parameters);
                                         var channel =response.result.parameters.Channel.toUpperCase();
                                         var program = response.result.parameters.Programs.toUpperCase();
                                         var time = response.result.parameters.timeofpgm;
                                         var dateofrecord = response.result.parameters.date;
                                         var SelectedSTB = response.result.parameters.SelectedSTB;
                                        console.log(channel ,program,time,dateofrecord,SelectedSTB);
  
                                    
exports.Record = new Record();
