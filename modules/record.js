// record.js
var restify = require('request');

var Record = function () {

    var channel = "";
    var program = "";
    var time = "";
    var dateofrecord = "";
    var SelectedSTB = "";
};

Record.prototype.doRecord = function (session, response, builder) {
    console.log("----------record.js:SELECTED INTENT IS recordnew----------");
    console.log("inside startsession");
    session.send("Recoding Started....");
    console.log(response.result.parameters);

    this.channel = (response.result.parameters.Channel.toUpperCase());
    this.program = (response.result.parameters.Programs.toUpperCase());
    this.time = (response.result.parameters.timeofpgm);
    this.dateofrecord = (response.result.parameters.date);
    this.SelectedSTB = (response.result.parameters.SelectedSTB);

    console.log("SelectedSTB : " + this.SelectedSTB + " channel : " + this.channel + "program : " + this.program + " dateofrecord :" + this.dateofrecord + " time :" + this.time);

    if (this.time == "")
    {
        PgmSearch(function (str)
        {
            res.json(PgmSearchCallback(session,str));
        });
    }
    else if (this.SelectedSTB == "" || this.SelectedSTB == undefined)
    {
        getstblist(function (subflow)
        {
            session.send(subflow);
        });
    }
}

//======================
function PgmSearch(callback) {
    console.log("strProgram " + this.strProgram + "strGenre " + this.strGenre + "strdate " + this.strdate);

    var headersInfo = { "Content-Type": "application/json" };

    var args = {
        "headers": headersInfo,
        "json": {
            Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
            Request: {
                ThisValue: 'AdvProgramSearch',
                BotstrTitleValue: this.strProgram,
                BotdtAirStartDateTime: this.strdate,
                BotstrGenreRootId: this.strGenre,
                BotstrStationCallSign: this.strChannelName
            }
        }
    };
    console.log("args " + args);

    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {

                console.log("body " + body);
                callback(body);
            }
            else
                console.log('error: ' + error + ' body: ' + body);
        }
    );
}


//==========================

function PgmSearchCallback(session,apiresp) {
    var objToJson = {};
    objToJson = apiresp;
    var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
    console.log("PgmSearchCallback ");
    //final output
    session.send({
        speech: "Here is the program details you are looking for",
        displayText: "Here is the program details you are looking for",
        data: subflow,
        source: "Verizon.js"
    });

}
//============================
function getstblist(callback) {
    STBList(function (str) {
        STBListCallBackNew(str, callback);
    });
}

exports.Record = new Record();
