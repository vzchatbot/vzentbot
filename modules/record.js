// record.js
var Record = function () { };

Record.prototype.doRecord =  function (session, response, builder){

    return (
        {
            console.log("-----------record.js : record intent -----------"); 
            console.log("Speech response : - "+ response.result.fulfillment.speech);            
            session.send(response.result.fulfillment.speech); 
        }
}
exports.Record = new Record();
