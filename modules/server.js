var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var servercall = require('./servicecall.js');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var PORT = process.env.PORT || 9000;

const FB_PAGE_ACCESS_TOKEN = "EAAZArBv48H88BAFGDLy0vltTEuqYDupSvx6ADaEZCeLq6GsiSe4vKmubESXMF3pRyme7dvb7jgTZA4dzbn1DpZAfGLyBr9geSqGKsiqr84xZBOr8blJnZCs6RnAz7tELkYzb1CK3vqOIPMpX7IPMDDB9dcmILSfLFStsSl7HKZBNRAIsoRDlGDb";

var router = express.Router();

var headersInfo = { "Content-Type": "application/json" };
var Client = require('node-rest-client').Client;
var client = new Client();
var args = {
    "headers": headersInfo
};


router.post('/webhook', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var action = req.body.result.action;
    var mysource = req.body.result.source;



    switch (action) {
        case "welcome":
            // res.json(chatInitiate());
            res.json(secondMsg(req));

            break;
        case "getStarted":
            res.json(welcomeMsg());
            break;
        case "LinkOptions":
            res.json(LinkOptions());
            break;
        case "MoreOptions":
            res.json(MoreOptions());
            break;
        case "Billing":
            STBList(req, function (str) { res.json(STBListCallBack(str)); });
            break;
        case "record":
            res.json(record(req));
            break;
        case "stblist":
            getstblist(req, function (subflow) { res.json(subflow); });
            break;
        case "upsell":
            res.json(upsell(req));
            break;
        case "upgradeDVR":
            res.json(upgradeDVR(req));
            break;
        case "stgexternalcall":
            recommendTVStg(function (str) { res.json(recommendTVNew1(str)); });
            break;
        case "Trending":
            recommendTVNew('Trending', function (str) { res.json(recommendTVNew1(str)); });
            break;
        case "recommendation":
            recommendTVNew('whatshot', function (str) { res.json(recommendTVNew1(str)); });
            break;
        case "channelsearch":
            ChnlSearch(req, function (str) { res.json(ChnlSearchCallback(str)); });
            break;
        case "programSearchdummy":
            res.json(programSearch(req));
            break;
        case "programSearch":
            PgmSearch(req, function (str) { res.json(PgmSearchCallback(str)); });
            break;
        case "recordnew":
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
        default:
            res.json(recommendTV());
    }
});

function firstMsg() {

    return {
        speech: "Your Purchase is done",
        displayText: "Your Purchase is done",
    };

}

function secondMsg(apireq) {
    console.log('inside secondMsg call ');
    //var stblst= {"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":"Select one of the STB from the below list, on which you like to record","buttons":[{"type":"postback","payload":"0000075999169227","title":"0000075999169227"}]}}}};
    //{ "facebook": { "attachment": { "type": "template", "payload": { "template_type": "button", "text": "Select one of the STB from the below list, on which you like to record", "buttons":[ { "type": "postback", "payload": "0000060661164198", "title": "Living Room" } ]} } } }	
    //var stblst={"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":"Here is the program details you are looking for","buttons":[{"type":"postback","title":"84 - Bundesliga Highlights Show II -  Fox Sport 2 - Oct  4 2016 12:00AM - Sports &amp; Fitness","payload":"1"},{"type":"postback","title":"84 - World Poker Tour -  Fox Sport 2 - Oct  4 2016  1:00AM - SHOWS","payload":"1"},{"type":"postback","title":"84 - World Poker Tour -  Fox Sport 2 - Oct  4 2016  2:00AM - SHOWS","payload":"1"}]}}}};
    //  stblst=   STBList(apireq,function (str) {STBListCallBack(str);  })

    //var stblst={"facebook":{ "text":"Pick a color:", "quick_replies":[ { "content_type":"text", "title":"Red", "payload":"red" }, { "content_type":"text", "title":"Green", "payload":"green" } ] }};

    var stblst = { "facebook": { "text": "Pick a color:", "quick_replies": [{ "content_type": "text", "title": "Red", "payload": "red", "image_url": "http://petersfantastichats.com/img/red.png" }, { "content_type": "text", "title": "Green", "payload": "green", "image_url": "http://petersfantastichats.com/img/green.png" }, { "content_type": "text", "title": "Blue", "payload": "blue", "image_url": "http://petersfantastichats.com/img/green.png" }, { "content_type": "text", "title": "yellow", "payload": "yellow", "image_url": "http://petersfantastichats.com/img/green.png" }, { "content_type": "text", "title": "i m trying big text", "payload": "green", "image_url": "http://petersfantastichats.com/img/green.png" }] } };

    return (
        {
            speech: "Second Message",
            displayText: "Second Message",
            data: stblst,
            source: "Verizon.js"
        });
}


function recommendTVNew(pgmtype, callback) {
    console.log('inside external call ');
    var headersInfo = { "Content-Type": "application/json" };
    var args = {
        "headers": headersInfo,
        "json": {
            Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
            Request: {
                ThisValue: pgmtype, BotstrVCN: '3452'
            }
        }
    };
    //https://www.verizon.com/fiostv/myservices/admin/testwhatshot.ashx 
    //https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx
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

function recommendTVNew1(apiresp) {
    var objToJson = {};
    objToJson = apiresp;
    var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
    //var subflow = objToJson;
    console.log("subflow :" + subflow)
    return ({
        speech: "Here are some recommendations for tonight",
        displayText: "TV recommendations",
        data: subflow,
        source: "Zero Service - app_zero.js"
    });

}

function STBList(apireq, callback) {
    console.log('inside external call ' + apireq.body.contexts);
    var struserid = '';
    for (var i = 0, len = apireq.body.result.contexts.length; i < len; i++) {
        if (apireq.body.result.contexts[i].name == "sessionuserid") {

            struserid = apireq.body.result.contexts[i].parameters.Userid;
            console.log("original userid " + ": " + struserid);
        }
    }

    if (struserid == '' || struserid == undefined) struserid = 'demoacct102'; //hardcoding if its empty

    console.log('struserid ' + struserid);
    var headersInfo = { "Content-Type": "application/json" };
    var args = {
        "headers": headersInfo,
        "json": {
            Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
            Request: { ThisValue: 'STBList', Userid: struserid }
        }

    };
    //https://www.verizon.com/fiostv/myservices/admin/testwhatshot.ashx 
    //https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx
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

function STBListCallBack(apiresp) {
    var objToJson = {};
    objToJson = apiresp;
    var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;

    console.log("subflow :" + subflow)
    return ({
        speech: "Select one of the DVR from the below list, on which you like to record",
        displayText: "STB List",
        data: subflow,
        source: "Verizon.js"
    });

}
function STBListCallBackNew(apiresp, callback) {
    var objToJson = {};
    objToJson = apiresp;
    var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;

    callback({
        speech: "Select one of the DVR from the below list, on which you like to record",
        displayText: "STB List",
        data: subflow,
        source: "Verizon.js"
    });

}

function ChnlSearch(apireq, callback) {
    var strChannelName = apireq.body.result.parameters.Channel.toUpperCase();

    console.log("strChannelName " + strChannelName);
    var headersInfo = { "Content-Type": "application/json" };
    var args = {
        "headers": headersInfo,
        "json": {
            Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
            Request: { ThisValue: 'ChannelSearch', BotstrStationCallSign: strChannelName }
        }

    };
    console.log("json " + String(args));

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

function ChnlSearchCallback(apiresp) {
    var objToJson = {};
    objToJson = apiresp;
    var chposition = objToJson[0].Inputs.newTemp.Section.Inputs.Response;

    console.log("chposition :" + chposition)
    return ({
        speech: "You can watch it at Channel position: " + chposition,
        displayText: "You can watch it at Channel position: " + chposition,
        // data: subflow,
        source: "Verizon.js"
    });

}

function PgmSearch(apireq, callback) {
    var strProgram = apireq.body.result.parameters.Programs;
    var strGenre = apireq.body.result.parameters.Genre;
    var strdate = apireq.body.result.parameters.date;
    var strChannelName = apireq.body.result.parameters.Channel;

    console.log("strProgram " + strProgram + "strGenre " + strGenre + "strdate " + strdate);

    var headersInfo = { "Content-Type": "application/json" };

    var args = {
        "headers": headersInfo,
        "json": {
            Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
            Request: {
                ThisValue: 'AdvProgramSearch',
                BotstrTitleValue: strProgram,
                BotdtAirStartDateTime: strdate,
                BotstrGenreRootId: strGenre,
                BotstrStationCallSign: strChannelName
            }
        }
    };


	/*
	if (strGenre == '' || strGenre == undefined)
	{
		var args = {
		"headers": headersInfo,
		"json": {Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
			 Request: {ThisValue: 'ProgramSearch', BotstrTitleValue:strProgram, BotdtAirStartDateTime : strdate} 
			}
		};
	}
	else
	{
		var args = {
		"headers": headersInfo,
		"json": {Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
			 Request: {ThisValue: 'ProgramSearch', BotstrGenreRootId : strGenre, BotdtAirStartDateTime : strdate} 
			}
		};
	
	}*/


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

function PgmSearchCallback(apiresp) {
    var objToJson = {};
    objToJson = apiresp;
    var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;


    return ({
        speech: "Here is the program details you are looking for",
        displayText: "Here is the program details you are looking for",
        data: subflow,
        source: "Verizon.js"
    });

}

function upgradeDVR(apireq) {
    var purchasepin = apireq.body.result.parameters.purchasepin.toUpperCase();
    if (purchasepin != "" || purchasepin != undefined)
        var respstr = "Congrats, Your DVR is upgraded.  Now  I can help you with  TV Recommendations or Recording a program. What would you like to do?";
    else
        var respstr = "Ok, we are not upgratding the DVR now.  Now  I can help you with  TV Recommendations or Recording a program. What would you like to do?";

    return ({
        speech: respstr,
        displayText: "TV Recommendations",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": respstr,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "TV Recommendations",
                                "payload": "Yes"
                            },
                            {
                                "type": "postback",
                                "title": "Record",
                                "payload": "I want to record"
                            }
                        ]
                    }
                }
            }
        },
        source: "Zero Service - app_zero.js"
    });

}


function LinkOptions() {
    console.log('Calling from  link options:');
    return (
        {
            speech: "Are you looking for something to watch, or do you want to see more options? Type or tap below.",
            displayText: "Link Account",
            data: {
                "facebook": {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "text": "Are you looking for something to watch, or do you want to see more options? Type or tap below.",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "On Now",
                                    "payload": "On Now"
                                },
                                {
                                    "type": "postback",
                                    "title": "On Later",
                                    "payload": "On Later"
                                },
                                {
                                    "type": "postback",
                                    "title": "More Options",
                                    "payload": "More Options"
                                }
                            ]
                        }
                    }
                }
            },
            source: "Verizon.js"
        }
    );

}

function welcomeMsg() {

    return (
        {
            speech: "Hey Tabi, welcome to Verizon! Want to know what’s on tonight?  I can answer almost anything, so try me! Also, if you want personalized alerts through Messenger link me to your Verizon account! ",
            displayText: "Link Account",
            data: {
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
            },
            source: "Verizon.js"
        }
    );

}

function MoreOptions() {

    return (
        {
            speech: "You can also ask 'What Channel is ESPN', ' what channel is Game of Thornes is on', 'any romantic comedies on tonight' or type 'support' to get account help from a Verizon representative. ",
            displayText: "Link Account",
            data: {
                "facebook": {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "text": "You can also ask 'What Channel is ESPN', ' what channel is Game of Thornes is on', 'any romantic comedies on tonight' or type 'support' to get account help from a Verizon representative. ",
                        }
                    }
                }
            },
            source: "Verizon.js"
        }
    );

}

function getstblist(apireq, callback) {
    STBList(apireq,
        function (str) {
            STBListCallBackNew(str, callback);
        });
}

function record(apireq) {

    var channel = apireq.body.result.parameters.Channel.toUpperCase();
    var program = apireq.body.result.parameters.Programs.toUpperCase();
    var time = apireq.body.result.parameters.timeofpgm;
    var dateofrecord = apireq.body.result.parameters.date;
    var SelectedSTB = apireq.body.result.parameters.SelectedSTB;
    console.log("SelectedSTB  :  " + SelectedSTB + " channel : " + channel + " dateofrecord :" + dateofrecord + " time :" + time);
    if (time == "") {
        return (


            {
                speech: " I see the below schedules for " + program + ". Tap on which time you like to record",
                displayText: "Subscribe",
                data: {
                    "facebook": {
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "button",
                                "text": " I see the below schedules for " + program + ". Tap on which time you like to record",
                                "buttons": [
                                    {
                                        "type": "postback",
                                        "title": "12:30",
                                        "payload": "12:30"
                                    },
                                    {
                                        "type": "postback",
                                        "title": "10:30",
                                        "payload": "12:30"
                                    }
                                ]
                            }
                        }
                    }
                },
                source: "Zero Service - app_zero.js"
            });

    }

    else if (channel == 'HBO') {
        return ({
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
    else if (SelectedSTB == "" || SelectedSTB == undefined) {
        //STBList(apireq,function (str) {STBListCallBack(str);  }); 

        //return secondMsg()

        return ({
            speech: "Select one of the DVR from the below list, on which you like to record",
            displayText: "Subscribe",
            data: {
                "facebook": {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "text": "Select one of the DVR from the below list, on which you like to record",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Living Room",
                                    "payload": "0000060661164198"
                                },
                                {
                                    "type": "postback",
                                    "title": "Bed Room",
                                    "payload": "0000060661164199"
                                }
                            ]
                        }
                    }
                }
            },
            source: "Zero Service - app_zero.js"
        });

    }
    else if (channel == 'CBS') {
        return ({
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
        var respstr = 'Your recording for "' + apireq.body.result.parameters.Programs + '" has been scheduled at ' + apireq.body.result.parameters.timeofpgm + ' on ' + apireq.body.result.parameters.SelectedSTB + ' STB.';
        return ({
            speech: respstr + "  Would you like to see some other TV Recommendations for tonight?",
            displayText: "TV Recommendations",
            data: {
                "facebook": {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "button",
                            "text": respstr + "  Would you like to see some other TV Recommendations for tonight?",
                            //"template_type":"generic",
                            //"elements":[
                            //	{
                            //		"title":"Hi,there. I am Ent, an entertainment bot.",
                            //		"image_url":"https://petersfancybrownhats.com/company_image.png",
                            //		"subtitle":"Would you like to see some recommendations for tonight?",
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
                                }
                            ]
                        }
                    }
                }
            },
            source: "Zero Service - app_zero.js"
        });
    }
}


function upsell(apireq) {

    var respstr = 'Congrats, Now you are subscribed for ' + apireq.body.result.parameters.Channel + " Channel.  Now  I can help you with  TV Recommendations or Recording a program. What would you like to do?";

    return ({
        speech: respstr,
        displayText: "TV Recommendations",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": respstr,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "TV Recommendations",
                                "payload": "Yes"
                            },
                            {
                                "type": "postback",
                                "title": "Record",
                                "payload": "I want to record"
                            }
                        ]
                    }
                }
            }
        },
        source: "Zero Service - app_zero.js"
    });
}

function pgmDetails() {
    return ({
        speech: "Here are some recommendations for tonight",
        displayText: "TV recommendations",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Shark Tank",
                                "subtitle": "Shark Tank",
                                "image_url": "http://image.vam.synacor.com.edgesuite.net/0f/07/0f07592094a2a596d2f6646271e9cb0311508415/w=414,h=303,crop=auto/?sig=88c390c980d4fa53d37ef16fbdc53ec3dfbad7d9fa626949827b76ae37140ac3&amp;app=powerplay",
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": "http://www.youtube.com/embed/SQ1W7RsXL3k",
                                        "title": "Watch video"
                                    },
                                    {
                                        "type": "web_url",
                                        "url": "https://m.verizon.com/myverizonmobile/router.aspx?token=tvlisting",
                                        "title": "Record"
                                    }
                                ]
                            },
                            {
                                "title": "Game of Thrones",
                                "subtitle": "Game of Thrones",
                                "image_url": "http://ia.media-imdb.com/images/M/MV5BMjM5OTQ1MTY5Nl5BMl5BanBnXkFtZTgwMjM3NzMxODE@._V1_UX182_CR0,0,182,268_AL_.jpg",
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": "https://www.youtube.com/watch?v=36q5NnL3uSM",
                                        "title": "Watch video"
                                    },
                                    {
                                        "type": "web_url",
                                        "url": "https://m.verizon.com/myverizonmobile/router.aspx?token=tvlisting",
                                        "title": "Record"
                                    }
                                ]
                            },
                            {
                                "title": "The Night Of",
                                "subtitle": "The Night Of",
                                "image_url": "http://ia.media-imdb.com/images/M/MV5BMjQyOTgxMDI0Nl5BMl5BanBnXkFtZTgwOTE4MzczOTE@._V1_UX182_CR0,0,182,268_AL_.jpg",
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": "https://www.youtube.com/watch?v=36q5NnL3uSM",
                                        "title": "Watch video"
                                    },
                                    {
                                        "type": "web_url",
                                        "url": "https://m.verizon.com/myverizonmobile/router.aspx?token=tvlisting",
                                        "title": "Record"
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        },
        source: "Zero Service - app_zero.js"
    });
}
function chatInitiate() {
    return ({
        speech: "Hi, I am Verizon Entertainment bot.  I can help you with  TV Recommendations or Recording a program. What would you like to do?",
        displayText: "TV Recommendations",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Hi, I am Verizon Entertainment bot.  I can help you with  TV Recommendations or Recording a program. What would you like to do?",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "TV Recommendations",
                                "payload": "Yes"
                            },
                            {
                                "type": "postback",
                                "title": "Record",
                                "payload": "I want to record"
                            }
                        ]
                    }
                }
            }
        },
        source: "Zero Service - app_zero.js"
    });
}

function channelsearch(apireq) {

    var chnNo = Math.floor(Math.random() * (500 - 1) + 1);
    var channel = apireq.body.result.parameters.Channel.toUpperCase();

    return (

        {
            speech: "You can watch " + channel + "  on Channel Number : " + chnNo,
            displayText: "You can watch " + channel + "  on Channel Number : " + chnNo,
            source: "Verizon.js"
        }
        /*  {
           speech: "Second Message You can watch " + channel + "  on Channel Number : "+ chnNo ,
           displayText: "Second Message You can watch " + channel + "  on Channel Number : "+ chnNo ,
           source: "Verizon.js"
       }*/



    );

}

function programSearch(apireq) {
    var program = apireq.body.result.parameters.Programs.toUpperCase();
    return ({
        speech: " I see the below schedules for " + program + ". Tap on which time you like to record",
        displayText: "Subscribe",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": " I see the below schedules for " + program + ". Tap on which time you like to record",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "HBO HD Channel 5  - 12:30 EST ",
                                "payload": "HBO HD Channel 5  - 12:30 EST ",
                            },
                            {
                                "type": "postback",
                                "title": "HBO SD Channel 15  - 10:30 EST ",
                                "payload": "HBO SD Channel 15  - 10:30 EST ",
                            }
                        ]
                    }
                }
            }
        },
        source: "Zero Service - app_zero.js"
    });

}

//------------------dummy methods
function myfunction() {
    console.log("inside fn call");
    var reqData = { "Flow": "TroubleShooting Flows\\Test\\APIChatBot.xml", "Request": { "ThisValue": "1" } };
    var Client = require('node-rest-client').Client;
    var client = new Client();
    var args = {
        "headers": headersInfo,
        "data": JSON.stringify(reqData)
    };
    console.log("before call");
    var req = client.post("https://vznode1.herokuapp.com/api/webhook/", args, function (data, response) {
        try {
            console.log("inside success");
            var parsedData = "";
            if (null != data) {
                console.log("data" + data);
                parsedData = JSON.parse(data);
                console.log("parsedData" + parsedData);
                var inputsJSON = parsedData[0];
                console.log("inputsJSON" + inputsJSON);
                headersInfo = response.headers;


            }
            else {
                var err = {
                    "description": "Response data is empty!",
                    "data": data
                };

            }
        }
        catch (ex) {
            var err = {
                "description": "Exception occurred:" + ex,
                "data": data
            };

        }
    });
    req.on("error", function (errInfo) {
        var err = {
            "description": "Exception occurred:" + errInfo.message,
            "data": ""
        };
        if (null != fnCallback && typeof fnCallback == "function") {
            console.log(err, null);
        }
    });
};


function performcall1(req, res) {

    res.end('welcome');
}


function performcall(req, res) {
    console.log("starting performcall");

    console.log(performcall1());

    var myresp = '';
    return request.post({
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        url: 'https://vznode1.herokuapp.com/api/webhook/',
        body: "mes=heydude"
    }, function (error, response, body) {
            console.log("inside fn call");
            if (!error && response.statusCode == 200) {
                //console.log(body); // Print the google web page.
                //callback(body);
                myresp = body;

                console.log(myresp);
            }
            else {
                console.log(error);
                console.log(response.statusCode);
                myresp = recommendTV();

            }
        }
    );

};


function callapi(callback) {
    //http://vzbotapi.azurewebsites.net/api/values
    request.post(
        'https://vznode1.herokuapp.com/api/webhook/',
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(body);
            }
        }
    );


};

function performRequest(endpoint, method, data, success) {
    console.log('staring performRequest ');
    var querystring = require('querystring');
    var https = require('https');

    var host = '';
    var username = '';
    var password = '';
    var apiKey = '';
    var sessionId = null;
    var deckId = '68DC5A20-EE4F-11E2-A00C-0858C0D5C2ED';
    var responseObject = '';
    var responseString = '';

    var dataString = JSON.stringify(data);
    var headers = {};

    if (method == 'GET') {
        endpoint += '?' + querystring.stringify(data);
    }
    else {
        headers = {
            'Content-Type': 'application/json',
            'Content-Length': dataString.length
        };
    }
    var options = {
        host: host,
        path: endpoint,
        method: method,
        headers: headers
    };

    var req = https.request(options, function (res) {
        res.setEncoding('utf-8');



        res.on('data', function (data) {
            responseString += data;

        });

        res.on('end', function () {
            console.log('responseString:' + responseString);
            responseObject = JSON.parse(responseString);
            //console.log('responseObject:'+ responseObject);
            //console.log('dataString:'+ dataString);

            success(responseObject);
        });
    });
    //console.log('endpoint:'+ endpoint);
    req.write(dataString);
    req.end();

    return {

        speech: 'response from call',
        displayText: "TV recommendations",
        data: responseObject,
        source: "test functions"
    }
};

function recommendTVStg(callback) {
    console.log('inside external call ');
    var headersInfo = { "Content-Type": "application/json" };
    var args = {
        "headers": headersInfo,
        "json": {
            Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
            Request: {
                ThisValue: 'Trending1'
            }
        }
    };

    request.post("https://www98.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
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

function welcomeInit() {
    var username = "";
    return (
        {
            speech: " Hey " + username + "Welcome to Verizon!",
            displayText: " Hey Tabi, Welcome to Verizon!",
            data: {
                "facebook": [
                    { "text": "Here is a video to watch:" },
                    { "sender_action": "typing_on" },
                    {
                        "attachment": {
                            "type": "video",
                            "payload": { "url": "http://path.to/video.mp4" }
                        }
                    }
                ]
            }

        }
    );
}

function recommendTV() {
    return ({
        speech: "Here are some recommendations for tonight",
        displayText: "TV recommendations",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Shark Tank",
                                "subtitle": "Shark Tank",
                                "image_url": "http://image.vam.synacor.com.edgesuite.net/0f/07/0f07592094a2a596d2f6646271e9cb0311508415/w=414,h=303,crop=auto/?sig=88c390c980d4fa53d37ef16fbdc53ec3dfbad7d9fa626949827b76ae37140ac3&amp;app=powerplay",
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": "http://www.youtube.com/embed/SQ1W7RsXL3k",
                                        "title": "Watch video"
                                    },
                                    {
                                        "type": "web_url",
                                        "url": "https://m.verizon.com/myverizonmobile/router.aspx?token=tvlisting",
                                        "title": "Record"
                                    }
                                ]
                            },
                            {
                                "title": "Game of Thrones",
                                "subtitle": "Game of Thrones",
                                "image_url": "http://ia.media-imdb.com/images/M/MV5BMjM5OTQ1MTY5Nl5BMl5BanBnXkFtZTgwMjM3NzMxODE@._V1_UX182_CR0,0,182,268_AL_.jpg",
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": "https://www.youtube.com/watch?v=36q5NnL3uSM",
                                        "title": "Watch video"
                                    },
                                    {
                                        "type": "web_url",
                                        "url": "https://m.verizon.com/myverizonmobile/router.aspx?token=tvlisting",
                                        "title": "Record"
                                    }
                                ]
                            },
                            {
                                "title": "The Night Of",
                                "subtitle": "The Night Of",
                                "image_url": "http://ia.media-imdb.com/images/M/MV5BMjQyOTgxMDI0Nl5BMl5BanBnXkFtZTgwOTE4MzczOTE@._V1_UX182_CR0,0,182,268_AL_.jpg",
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": "https://www.youtube.com/watch?v=36q5NnL3uSM",
                                        "title": "Watch video"
                                    },
                                    {
                                        "type": "web_url",
                                        "url": "https://m.verizon.com/myverizonmobile/router.aspx?token=tvlisting",
                                        "title": "Record"
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        },
        source: "Zero Service - app_zero.js"
    });
}

function billInquiry() {
    return ({
        speech: "Let me get an expert to help you.  Please click on the link below.",
        displayText: "TV Recommendations",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Unfortunately, I'm unable to help with that query.  Would you like to talk to an expert?",
                        "buttons": [
                            {
                                "type": "phone_number",
                                "title": "Talk to an agent",
                                "payload": "+919962560884"
                            },
                            {
                                "type": "postback",
                                "title": "No, thanks",
                                "payload": "No, thanks"
                            }
                        ]
                    }
                }
            }
        },
        source: "Zero Service - app_zero.js"
    });
}
// more routes for our API will happen here
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

app.use('/api', router);
app.listen(PORT, function () {
    console.log('Listening on port ' + PORT);
});
