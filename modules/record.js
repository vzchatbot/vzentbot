// record.js
var Record = function () { };

Record.prototype.doRecord = function (req, res) {

    return (
        {
            console.log("inside startsession");                                   
            session.send(response.result.fulfillment.speech);
          
        }

}

/*
Record.prototype.doRecord = function (req, res) {
    var channel = req.body.result.parameters.Channel.toUpperCase();
    var program = req.body.result.parameters.Programs.toUpperCase();
    var time = req.body.result.parameters.timeofpgm;
    var dateofrecord = req.body.result.parameters.date;
    var SelectedSTB = req.body.result.parameters.SelectedSTB;
    console.log("SelectedSTB : " + SelectedSTB + " channel : " + channel + " dateofrecord :" + dateofrecord + " time :" + time);
    if (time == "") { PgmSearch(req, function (str) { res.json(PgmSearchCallback(str)); }); }
    else if (SelectedSTB == "" || SelectedSTB == undefined) { getstblist(req, function (subflow) { res.json(subflow); }); }
    else if (channel == 'HBO') //not subscribed case
    {
        res.json({
            speech: " Sorry you are not subscribed to " + channel + ". Would you like to subscribe " + channel + "?",
            displayText: "Subscribe",
            data: {
                "facebook": {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "text": " Sorry you are not subscribed to " + channel + ". Would you like to subscribe " + channel + "?",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Subscribe",
                                    "payload": "Subscribe"
                                },
                                {
                                    "type": "postback",
                                    "title": "No, I'll do it later ",
                                    "payload": "No Subscribe"
                                }
                            ]
                        }
                    }
                }
            },
            source: "Zero Service - app_zero.js"
        });

    }
    else if (channel == 'CBS')  //DVR full case
    {
        res.json({
            speech: " Sorry your DVR storage is full.  Would you like to upgrade your DVR ?",
            displayText: "Subscribe",
            data: {
                "facebook": {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "text": " Sorry your DVR storage is full.  Would you like to upgrade your DVR ?",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Upgrade my DVR",
                                    "payload": "Upgrade my DVR"
                                },
                                {
                                    "type": "postback",
                                    "title": "No, I'll do it later ",
                                    "payload": "No Upgrade"
                                }
                            ]
                        }
                    }
                }
            },
            source: "Zero Service - app_zero.js"
        });

    }
    else {

        console.log(" Channel: " + req.body.result.parameters.Channel + " Programs: " + req.body.result.parameters.Programs + " SelectedSTB: " + req.body.result.parameters.SelectedSTB + " Duration: " + req.body.result.parameters.Duration + " FiosId: " + req.body.result.parameters.FiosId + " RegionId: " + req.body.result.parameters.RegionId + " STBModel: " + req.body.result.parameters.STBModel + " StationId: " + req.body.result.parameters.StationId + " date: " + req.body.result.parameters.date + " timeofpgm: " + req.body.result.parameters.timeofpgm);

        var respstr = 'Your recording for "' + req.body.result.parameters.Programs + '" has been scheduled at ' + req.body.result.parameters.timeofpgm + ' on ' + req.body.result.parameters.SelectedSTB + ' STB.';
        res.json({
            speech: respstr + " Would you like to see some other TV Recommendations for tonight?",
            displayText: "TV Recommendations",
            data: {
                "facebook": {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "text": respstr + " Would you like to see some other TV Recommendations for tonight?",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Show Recommendations",
                                    "payload": "Show Recommendations"
                                },
                                {
                                    "type": "postback",
                                    "title": "More Options",
                                    "payload": "More Options"
                                }]
                        }
                    }
                }
            },
            source: "Verizon.js"
        });
    }

    break;
};
*/
exports.Record = new Record();
