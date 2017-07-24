/**
 
 Copyright 2016 Brian Donohue.
 
*/
'use strict';
const Alexa = require('alexa-sdk');
//var http = require('http');
var request = require('request');

const APP_ID = 'amzn1.ask.skill.ab68107d-d1bc-45cf-8ba7-1cba66c0d4be';
// TODO replace with your app ID (OPTIONAL)

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function(event, context) {
    try {

        console.log("Inside the exports handlers of event and context")
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);
        console.log("Request info " + JSON.stringify(event));

        if (event.session.new) {
            onSessionStarted({
                requestId: event.request.requestId
            }, event.session);
        }

        if (event.request.type === "LaunchRequest") {

            console.log("On launch Request");
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });

        } else if (event.request.type === "IntentRequest") {

            console.log("On IntentRequest " + event.request.intent.name);
            //console.log("Session Attributes  " + JSON.stringify(sessionAttributes));

            onIntent(event.request, event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });

        } else if (event.request.type === "SessionEndedRequest") {

            onSessionEnded(event.request, event.session);
            context.succeed();
            console.log("On sessionEndedRequest");
        }
    } catch (e) {
        context.fail("Exception: " + e);
        console.log("Error on handler " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId + ", sessionId=" + session.sessionId);
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Good Bye';
    //const speechOutput = 'Thank you for trying the Verizon F\'yos. Good Bye! Have a nice day!';
    const speechOutput = "Okay! Thank you for trying the Verizon F\'yos. I am there to help you any time. " +
        "Remember You can also ask me anytime by saying <break time='1s'/> What is my bill , <break time='1s'/> Or My Network details or <break time='1s'/> " +
        "or any other support related queries Good Bye! Have a nice day!";
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSSMLSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log('onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}');

    // Dispatch to your skill's launch.
    wakeupfios(callback);
    var visionCustID = '154190083';
    var BTN = '7328422487';
    var State = 'NJ';
}

function wakeupfios(callback) {
    console.log("get wakeup Called");

    var shouldEndSession = false;
    var repromptText = "Welcome to verizon F\'yos. I am there to help you any time." +
        "<break time='1s'/> You can also ask me anytime by saying <break time='1s'/> What is my bill <break time='1s'/> Or My Network details.";
    //var speechOutput = 'Welcome to F\'yos. <break time="1s"/>Today I see you have one alert which you need to take care. <break time="1s"/> say Alert to provide information on your alert <break time="1s"/> or Just say Stop.';
    var speechOutput = "Welcome to verizon F\'yos. I am there to help you any time.";
    var cardTitle = "Wake up verizon";

    var sessionAttributes = {
        "currentintent": "onlaunch",
        "speechOutput": speechOutput,
        "repromptText": repromptText,
        "ReplaceOrTBLQue": "YES",
        "deliveryQuestion": "",
        "DashboardInfo": "",
        "previousintent": "",
        "lastspeech": speechOutput,
        "lastreprompt": repromptText,
        "ONTprice": ""
    }
    callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    console.log("get wakeup completed");
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log('Inside onIntent');
    console.log("onIntent requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId);
    console.log("onIntent Intent Name " + intentRequest.intent.name);

    var intent = intentRequest.intent;
    var intentName = intentRequest.intent.name;
    let shouldEndSession = false;
    var sessionAttributes = {};
    var repromptText = null;
    let speechOutput = '';
    var cardTitle = '';
    var sender = '1258205930971788';
    session.attributes.RegisteredPhoneNumber = '8139570764';

    if (intentName == 'BillEnquiry') {
        HandleTextInformation(intent, session, callback);
        // showBillInfo(sender, function(str) {
        // showBillInfoCallback(str, sender, callback)
        // });
    } else if (intentName == 'GetWifiInfo') {
        HandleGetWifiInfoIntent(intent, session, callback);
    } else if (intentName == 'GetWifiDetails') {
        HandleTextInformation(intent, session, callback);
    } else if (intentName == 'GetRouterInfo') {
        HandleGetRouterInfromationIntent(intent, session, callback);
    } else if (intentName == 'RebootRouter') {
        HandleRebootRouterIntent(intent, session, callback);
    } else if (intentName == 'SpeedTest') {
        HandleSpeedtestInformation(intent, session, callback);
    } else if (intentName == 'UpdateNetwork') {
        HandleUpdateWifiInfoIntent(intent, session, callback);
    } else if (intentName == 'UpdatePassword') {
        HandleUpdateWifiInformationIntent(intent, session, callback);
    } else if (intentName == 'GetIpDevice') {
        HandleGetIpDevicesInformationIntent(intent, session, callback);
    } else if (intentName == 'NetworkAccessGetIpDevice') {
        HandleNetworkAccessGetIpDevicesIntent(intent, session, callback);
    } else if (intentName == 'TVPrograms') {
        HandleProgramSearch(intent, session, callback);
    } else if (intentName == 'TVProgramsType') {
        ShowProgramList(intent, session, callback);
    } else if (intentName == 'ReadContent') {

        if (intent.slots.OperationType.value == 'read') {
            if (session.attributes.lastIntentForRead == 'GetWifiDetails') {
                HandleGetWifiInformationIntent(intent, session, callback);
            } else if (session.attributes.lastIntentForRead == 'BillEnquiry') {
                speechOutput = "your bill amount is <break time='1s'/> $181 and due date is <break time='1s'/> 17/07/2017.";
                session.attributes.lastspeech = speechOutput;
                callback(sessionAttributes, buildSSMLSpeechletResponse('Bill details', speechOutput, speechOutput, shouldEndSession));
            } else {
                HandleErrorMessage(intent, session, callback);
            }
        } else if (intent.slots.OperationType.value == 'text') {
            if (session.attributes.lastIntentForRead == 'GetWifiDetails') {
                HandleSendingText(intent, session, callback);
            } else if (session.attributes.lastIntentForRead == 'BillEnquiry') {
                HandleSendingText(intent, session, callback);
            } else {
                HandleErrorMessage(intent, session, callback);
            }
        } else {
            HandleErrorMessage(intent, session, callback);
        }
    } else if (intentName == 'SelectNext') {
        if (session.attributes != {}) {
            console.log("Current intent inside next : ", session.attributes.currentintent);
            if (session.attributes.currentintent != undefined) {
                if (session.attributes.currentintent == "GetIPDevicesInternetAccess") {
                    HandleNextIntent(intent, session, callback);
                } else if (session.attributes.currentintent == "GetRomanticProgram") {
                    HandleNextProgram(intent, session, callback);
                } else {
                    HandleErrorMessage(intent, session, callback);
                }
            } else {
                HandleErrorMessage(intent, session, callback);
            }
        } else {
            HandleErrorMessage(intent, session, callback);
        }
    } else if (intentName == 'AMAZON.StartOverIntent') {
        wakeupfios(callback);
    } else if (intentName == 'AMAZON.StopIntent' || intentName == 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else if (intentName == 'AMAZON.YesIntent') {
        //handleSessionEndRequest(callback);
        console.log('Get the intent from session ' + JSON.stringify(session));
        if (session.attributes) {
            console.log(session.attributes.currentintent);
            if (session.attributes.currentintent == "GetIPDevicesInternetAccess") {
                session.attributes["devStatus"] = true;
                HandleNetworkAccessIntent(intent, session, callback);
            } else if (session.attributes.currentintent == "GetRomanticProgram") {
                HandleWatchProgram(intent, session, callback);
            } else {
                HandleErrorMessage(intent, session, callback);
            }
        }
    } else if (intentName == 'AMAZON.NoIntent') {
        if (session.attributes) {
            console.log(session.attributes.currentintent);
            if (session.attributes.currentintent == "GetIPDevicesInternetAccess") {
                HandleNextIntent(intent, session, callback);
            } else {
                HandleErrorMessage(intent, session, callback);
            }
        }
    } else if (intentName == 'AMAZON.RepeatIntent') {

        console.log('Repeat Intent');
        speechOutput = session.attributes.lastspeech;
        shouldEndSession = false;
        repromptText = session.attributes.lastreprompt;
        sessionAttributes = session.attributes;
        callback(sessionAttributes, buildSSMLSpeechletResponse('Repeat', session.attributes.lastspeech, session.attributes.lastreprompt, shouldEndSession));
    } else {
        console.log("Intent not found");
        HandleErrorMessage(intent, session, callback);
    }

}

function HandleErrorMessage(intent, session, callback) {
    var speechOutput = "Sorry! I can't help you with your request. Please ask me saying my bill details or network details.";
    var shouldEndSession = false;
    var repromptText = "Sorry! I can't help you with your request. Please ask me saying my bill details or network details.";
    var sessionAttributes = session.attributes;
    session.attributes.lastspeech = speechOutput;
    callback(sessionAttributes, buildSSMLSpeechletResponse('Error response', speechOutput, repromptText, shouldEndSession));
}


function showBillInfo(sender, callback) {
    console.log("showBillInfo Called");
    try {

        var args = {
            json: {
                Flow: 'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',
                Request: {
                    ThisValue: 'BillInfo',
                    BotProviderId: sender
                }
            }
        };

        console.log(" Request for showBillInfo json " + JSON.stringify(args.json));

        request.post({
                url: 'https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx',
                proxy: '',
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                json: args.json
            },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {

                    console.log('Called the callback now')
                    callback(body);
                } else {

                    console.log('error on callback for showBillInfo : ' + error);
                }
            }
        );
    } catch (experr) {
        console.log('error on  showBillInfo : ' + experr);
    }
    console.log("showBillInfo completed");
}

function showBillInfoCallback(apiresp, senderid, callback) {

    var objToJson = {};
    objToJson = apiresp;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";
    let title = "Bill Enquiry";

    try {

        var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
        console.log("SessionAttributes from Bill Info call =" + JSON.stringify(callback));

        console.log("Response from showBillInfoCallback=" + JSON.stringify(subflow));

        if (subflow != null && subflow.facebook != null && subflow.facebook.text != null && subflow.facebook.text == 'UserNotFound') {
            console.log("showBillInfo subflow " + subflow.facebook.text);
            //speechOutput = "You dont have any due to Verizon";
            speechOutput = 'Your bill is $250.60 <break time="1s"/> and due on Feb 27th 2017';
            shouldEndSession = false;
            session.attributes.lastspeech = speechOutput;
            callback(sessionAttributes, buildSSMLSpeechletResponse(title, speechOutput, repromptText, shouldEndSession));
        } else {
            //sendFBMessage(senderid, subflow.facebook, userCoversationArr);
            speechOutput = subflow.facebook.text;
            shouldEndSession = false;
            session.attributes.lastspeech = speechOutput;
            callback(sessionAttributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
        }



    } catch (experr) {
        console.log('error on  showBillInfo callback: ' + experr);
    }
}

//Send information to registered mobile number
function HandleTextInformation(intent, session, callback) {
    var speechOutput = "Do you want to text the information to your registerd mobile number <break time='1s'/> <say-as interpret-as='spell-out'><prosody rate='x-slow'>" + session.attributes.RegisteredPhoneNumber + "</prosody></say-as> or do you want me to read it ?";
    session.attributes.lastspeech = speechOutput;
    session.attributes.lastIntentForRead = intent.name;
    if (intent.name == 'GetWifiDetails')
        session.attributes.lastIntentSlotName = intent.slots.NetworkType.value;

    callback(session.attributes, buildSSMLSpeechletResponse('Text or read popup', speechOutput, speechOutput, false));
}

//sending the info vie text
function HandleSendingText(intent, session, callback) {
    var speechOutput = "Your requested information will be send to your registerd mobile number <break time='1s'/> <say-as interpret-as='spell-out'><prosody rate='x-slow'>" + session.attributes.RegisteredPhoneNumber + "</prosody></say-as>";
    session.attributes.lastspeech = speechOutput;
    callback(session.attributes, buildSSMLSpeechletResponse('send information via text', speechOutput, speechOutput, false));
}

//handle network access getIpDevices
function HandleNetworkAccessGetIpDevicesIntent(intent, session, callback) {
    var speechOutput = "An error found";
    var repromptText = "Please tell me your question by saying, <break time='1s'/> yes or <break time='1s'/> no to block or unblock the device.";
    getIpDevicesJSON(function(data) {
        if (data != 'ERROR') {
            var i = 0;
            var list_of_devices = data.body.nodes;
            list_of_devices = Array.isArray(data.body.nodes) ? data.body.nodes : JSON.parse("[" + JSON.stringify(data.body.nodes) + "]");
            console.log("List of devices  : ", list_of_devices);
            list_of_devices.forEach(function(item) {
                console.log("Item : ", item);
                if (item.status == true) {
                    session.attributes[i] = item;
                    console.log("New Item added : ", session.attributes[i])
                    i++;
                }
            });
            session.attributes["ITEM_COUNT"] = i;
            session.attributes.currentintent = "GetIPDevicesInternetAccess"
            session.attributes["DISPLAY_ITEM_COUNT"] = 0;
            console.log("Total Item Count : ", session.attributes["ITEM_COUNT"]);

            speechOutput = "Please say, " + " yes to block," + " and  no  or," + " next to choose next device." + " Do you want to block internet for " + session.attributes[session.attributes["DISPLAY_ITEM_COUNT"]].name;
        } else {
            speechOutput = repromptText;
        }
        session.attributes.lastspeech = speechOutput;
        callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, false));
    });
}

//handle network access getIpDevices
function HandleNextIntent(intent, session, callback) {
    var speechOutput = "An error found";
    var repromptText = "Please tell me your question by saying, <break time='1s'/> yes or no to block <break time='1s'/> or unblock the device.";
    console.log("Increased index by 1")
    session.attributes["DISPLAY_ITEM_COUNT"] = parseInt(session.attributes["DISPLAY_ITEM_COUNT"]) + 1;

    if (parseInt(session.attributes["ITEM_COUNT"]) <= parseInt(session.attributes["DISPLAY_ITEM_COUNT"])) {
        console.log("Chnaged value to zero again...");
        session.attributes["DISPLAY_ITEM_COUNT"] = 0;
    }

    console.log("Display count value : ", session.attributes["DISPLAY_ITEM_COUNT"]);
    console.log("Display item value : ", session.attributes[session.attributes["DISPLAY_ITEM_COUNT"]]);
    speechOutput = "Do you want to block internet for " + session.attributes[session.attributes["DISPLAY_ITEM_COUNT"]].name;
    session.attributes.lastspeech = speechOutput;
    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, false));
}

//handle network access getIpDevices
function HandleNetworkAccessIntent(intent, session, callback) {
    var speechOutput = "An error found";
    var repromptText = "Please tell me your question by saying, yes or no to block or unblock the device.";
    updateIPDevicesJSON(intent, session, function(data) {
        if (data != 'ERROR') {
            var speechString = "";
            console.log("speechString : ", session.attributes["devStatus"]);
            if (session.attributes["devStatus"] == true)
                speechString = "blocked";
            else
                speechString = "unblocked";
            speechOutput = session.attributes[session.attributes["DISPLAY_ITEM_COUNT"]].name + " Has been " + speechString + " successfully.";
        } else {
            speechOutput = repromptText;
        }
        session.attributes.lastspeech = speechOutput;
        callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, false));
    });
}

//get router details
function updateIPDevicesJSON(intent, session, callback) {
    console.log("UpdateIPDevices API call triggered");
    var currentDevice = session.attributes["DISPLAY_ITEM_COUNT"];
    console.log("Current device index count : ", currentDevice);
    console.log("Currently selected device details ", session.attributes[currentDevice]);
    console.log("Blocked : ", session.attributes["devStatus"]);
    //get wif information
    var responseData = {
        "serialNo": "Success"
    };
    console.log("UpdateIPDevices api call completed...");
    if (responseData != "")
        callback("Success");
    else
        callback('ERROR');
}

function HandleSpeedtestInformation(intent, session, callback) {
    var speechOutput = "Your upload speed is <break time='1s'/> 70 mbps and downlaod speed is <break time='1s'/> 85 mbps.";
    var repromptText = "Please tell me your question by saying, <break time='1s'/> run SpeedTest.";
    session.attributes.lastspeech = speechOutput;
    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, false));
}

//handle router information
function HandleRebootRouterIntent(intent, session, callback) {
    var speechOutput = "An error found";
    var repromptText = "Please tell me your question by saying, reboot router.";
    getRebootRouterJSON(function(data) {
        if (data != 'ERROR') {
            speechOutput = "Your router rebooted successfully. Please wait for few minutes until your router is back in network.";
        } else {
            speechOutput = repromptText;
        }
        session.attributes.lastspeech = speechOutput;
        callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, false));
    });
}

//get router details
function getRebootRouterJSON(callback) {
    console.log("getRouter API call triggered");
    //get wif information
    var responseData = {
        "serialNo": "Success"
    };
    console.log("getRouter api call completed...");
    if (responseData != "")
        callback(responseData);
    else
        callback('ERROR');
}

//handle router information
function HandleGetRouterInfromationIntent(intent, session, callback) {
    var speechOutput = "Sorry! unable to process your request.";
    var repromptText = "Please tell me your question by saying, my router details";
    getRouterJSON(function(data) {
        if (data != 'ERROR') {
            speechOutput = "Router serial number is  " + data.serialNo + ", type is " + data.type + " and ip is " + data.ip;
        } else {
            speechOutput = repromptText;
        }
        session.attributes.lastspeech = speechOutput;
        callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, false));
    });
}

//get router details
function getRouterJSON(callback) {
    console.log("getRouter API call triggered");
    //get wif information
    var responseData = {
        "serialNo": "G1A115121001636",
        "type": "BHR4",
        "ip": "96.248.7.58"
    };
    console.log("getRouter api call completed...");
    if (responseData != "")
        callback(responseData);
    else
        callback('ERROR');
}

//handle router information
function HandleGetIpDevicesInformationIntent(intent, session, callback) {
    var speechOutput = "An error found";
    var repromptText = "Please tell me your question by saying, <break time='1s'/> connected device count.";
    getIpDevicesJSON(function(data) {
        if (data != 'ERROR') {
            console.log("Node count : ", Object.keys(data.body.nodes).length);
            speechOutput = Object.keys(data.body.nodes).length + " devices are connected with your router";
        } else {
            speechOutput = repromptText;
        }
        session.attributes.lastspeech = speechOutput;
        callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, false));
    });
}

//get router details
function getIpDevicesJSON(callback) {
    console.log("getIpDevices API call triggered");
    //get wif information
    var responseData = {
        "from": "~\/G1A115121001636\/ipdevices",
        "to": "~\/u1\/router",
        "type": "is",
        "body": {
            "nodes": [{
                "blocked": false,
                "connectionType": 4,
                "deviceExclusion": false,
                "deviceManufacturer": "",
                "deviceType": "",
                "ipAddress": "192.168.1.224",
                "ipv6Address": "",
                "leaseExpires": 1068,
                "mac": "f0:27:65:91:bc:5f",
                "name": "JohnAndroidPhone",
                "pcEligibility": true,
                "staticIp": false,
                "status": true,
                "deviceConnectedVia": "",
                "dispSlowDevices": false,
                "isSlowDevice": false,
                "networkStandardType": "",
                "pathID": "dev5",
                "phyRate": "390 Mbps",
                "rssi": -54,
                "snr": 38,
                "wifiStrength": "S"
            }, {
                "blocked": false,
                "connectionType": 5,
                "deviceExclusion": false,
                "deviceManufacturer": "",
                "deviceType": "",
                "ipAddress": "192.168.1.169",
                "ipv6Address": "",
                "leaseExpires": 1231,
                "mac": "b4:ce:f6:9e:5a:6f",
                "name": "android-66f8cd8a59b788e8",
                "pcEligibility": true,
                "staticIp": false,
                "status": false,
                "deviceConnectedVia": "",
                "dispSlowDevices": false,
                "isSlowDevice": false,
                "networkStandardType": "",
                "pathID": "dev4",
                "phyRate": "",
                "rssi": 0,
                "snr": 0,
                "wifiStrength": "S"
            }, {
                "blocked": false,
                "connectionType": 4,
                "deviceExclusion": false,
                "deviceManufacturer": "",
                "deviceType": "",
                "ipAddress": "192.168.1.168",
                "ipv6Address": "",
                "leaseExpires": 778,
                "mac": "8c:f5:a3:2c:3a:6b",
                "name": "android-d42217674fd2eb48",
                "pcEligibility": true,
                "staticIp": false,
                "status": false,
                "deviceConnectedVia": "",
                "dispSlowDevices": false,
                "isSlowDevice": false,
                "networkStandardType": "",
                "pathID": "dev3",
                "phyRate": "",
                "rssi": 0,
                "snr": 0,
                "wifiStrength": "S"
            }, {
                "blocked": false,
                "connectionType": 7,
                "deviceExclusion": false,
                "deviceManufacturer": "",
                "deviceType": "",
                "ipAddress": "192.168.1.101",
                "ipv6Address": "",
                "leaseExpires": 1030,
                "mac": "20:c0:47:0d:17:6e",
                "name": "Fios-TV-STB617F6E0C",
                "pcEligibility": false,
                "staticIp": false,
                "status": true,
                "deviceConnectedVia": "",
                "dispSlowDevices": false,
                "isSlowDevice": false,
                "networkStandardType": "",
                "pathID": "dev1",
                "phyRate": "780 Mbps",
                "rssi": -49,
                "snr": 43,
                "wifiStrength": "S"
            }, {
                "blocked": false,
                "connectionType": 1,
                "deviceExclusion": false,
                "deviceManufacturer": "",
                "deviceType": "",
                "ipAddress": "192.168.1.100",
                "ipv6Address": "",
                "leaseExpires": 1034,
                "mac": "20:c0:47:0d:18:59",
                "name": "Fios-TV-STB617F6E12",
                "pcEligibility": false,
                "staticIp": false,
                "status": true,
                "deviceConnectedVia": "",
                "dispSlowDevices": false,
                "isSlowDevice": false,
                "networkStandardType": "",
                "pathID": "dev2",
                "phyRate": "",
                "rssi": 0,
                "snr": 0,
                "wifiStrength": "S"
            }, {
                "blocked": false,
                "connectionType": 1,
                "deviceExclusion": false,
                "deviceManufacturer": "",
                "deviceType": "",
                "ipAddress": "192.168.1.250",
                "ipv6Address": "fe80::b01e:866b:b77:5d8e",
                "leaseExpires": 1028,
                "mac": "00:24:be:ae:4a:9c",
                "name": "IHALAB-SONY",
                "pcEligibility": true,
                "staticIp": false,
                "status": true,
                "deviceConnectedVia": "",
                "dispSlowDevices": false,
                "isSlowDevice": false,
                "networkStandardType": "",
                "pathID": "dev0",
                "phyRate": "",
                "rssi": 0,
                "snr": 0,
                "wifiStrength": "S"
            }]
        }
    };
    console.log("getIpDevices api call completed...");
    if (responseData != "")
        callback(responseData);
    else
        callback('ERROR');
}


//handle wifi information
function HandleUpdateWifiInfoIntent(intent, session, callback) {
    var speechOutput = "Which network password do you want to reset? <break time='1s'/> primary, <break time='1s'/> secondary or <break time='1s'/> guest? Please try saying <break time='1s'/> reset primary or <break time='1s'/> change password.";
    var repromptText = "Please tell me your question by saying, <break time='1s'/> my network details";

    session.attributes.lastspeech = speechOutput;
    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, false));
}

//handle wifi information
function HandleUpdateWifiInformationIntent(intent, session, callback) {
    var speechOutput = "An error found";
    var repromptText = "Sorry! unable to update your wifi details. Please try again by saying reset network type.";

    speechOutput = "We are strongly recomend you to use my  F\'Yos app to reset your password.";
    session.attributes.lastspeech = speechOutput;
    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, false));

}

//handle wifi information
function HandleGetWifiInfoIntent(intent, session, callback) {
    var speechOutput = "Which network details are you looking for, primary, secondary or guest network?";
    var repromptText = "Please tell me your question by saying, my network details";

    session.attributes.lastspeech = speechOutput;
    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, false));
}

//handle wifi information
function HandleGetWifiInformationIntent(intent, session, callback) {
    var speechOutput = "An error found";
    var repromptText = "Sorry! unable to find your wifi details. Please try again by saying network type.";
    getJSON(function(data) {
        if (data != 'ERROR') {
            console.log("Slot name : ", session.attributes.lastIntentSlotName);
            if (session.attributes.lastIntentSlotName == "secondary")
                speechOutput = "Your Wi-Fi Information for 2.4GHz network, <break time='1s'/> Wifi name is, <break time='1s'/> <say-as interpret-as='spell-out'><prosody rate='x-slow'>" + data.body.nodes[0].ssid + "</prosody></say-as>  <break time='1s'/> and password is, <break time='1s'/> <say-as interpret-as='spell-out'><prosody rate='x-slow'>" + data.body.nodes[0].security.wpa.key + "</prosody></say-as>";
            else if (session.attributes.lastIntentSlotName == "primary")
                speechOutput = "Your Wi-Fi Information for 5GHz network, <break time='1s'/> Wifi name is, <break time='1s'/> <say-as interpret-as='spell-out'><prosody rate='x-slow'>" + data.body.nodes[1].ssid + "</prosody></say-as>  <break time='1s'/> and password is, <break time='1s'/> <say-as interpret-as='spell-out'><prosody rate='x-slow'>" + data.body.nodes[1].security.wpa.key + "</prosody></say-as>";
            else if (session.attributes.lastIntentSlotName == "guest")
                speechOutput = "Your Wi-Fi Information for guest network, <break time='1s'/> Wifi name is, <break time='1s'/> <say-as interpret-as='spell-out'><prosody rate='x-slow'>" + data.body.nodes[2].ssid + "</prosody></say-as>  <break time='1s'/> and password is, <break time='1s'/> <say-as interpret-as='spell-out'><prosody rate='x-slow'>" + data.body.nodes[2].security.wpa.key + "</prosody></say-as>";
            else
                speechOutput = "Not sure what exactly you are looking for";
        } else {
            speechOutput = repromptText;
        }
        session.attributes.lastspeech = speechOutput;
        callback(session.attributes, buildSSMLSpeechletResponse("Verizon", speechOutput, repromptText, false));
    });
}

//get wifi details
function getJSON(callback) {
    console.log("getWifi API call triggered");
    try {
        var responseData = {
            "from": "~\/G1A115121001636\/wifi",
            "to": "~\/u1\/router",
            "type": "is",
            "body": {
                "nodes": [{
                    "channelDesired": 0,
                    "channelUsed": 0,
                    "enabled": true,
                    "mode": 8,
                    "pathID": "secondary",
                    "radioFreq": 1,
                    "rxPackets": 29,
                    "ssid": "FiOS-2.4",
                    "ssidBroadcast": true,
                    "txPackets": 4781,
                    "wmm": true,
                    "security": {
                        "enabled": true,
                        "type": 2,
                        "wep": {
                            "activeSetting": 0,
                            "authenticationType": 2,
                            "settings": [{
                                "entryMethod": 0,
                                "key": "",
                                "keyLength": 0
                            }, {
                                "entryMethod": 0,
                                "key": "",
                                "keyLength": 0
                            }, {
                                "entryMethod": 0,
                                "key": "",
                                "keyLength": 0
                            }, {
                                "entryMethod": 0,
                                "key": "",
                                "keyLength": 0
                            }]
                        },
                        "wpa": {
                            "encryptionAlgorithm": 0,
                            "groupKeyUpdateInterval": 3600,
                            "groupKeyUpdateIntervalEnabled": true,
                            "key": "FIOS123",
                            "type": 1
                        }
                    }
                }, {
                    "channelDesired": 0,
                    "channelUsed": 0,
                    "enabled": true,
                    "mode": 16,
                    "pathID": "primary",
                    "radioFreq": 0,
                    "rxPackets": 11014,
                    "ssid": "FiOS-5",
                    "ssidBroadcast": true,
                    "txPackets": 112297,
                    "wmm": true,
                    "security": {
                        "enabled": true,
                        "type": 2,
                        "wep": {
                            "activeSetting": 0,
                            "authenticationType": 2,
                            "settings": [{
                                "entryMethod": 0,
                                "key": "",
                                "keyLength": 0
                            }, {
                                "entryMethod": 0,
                                "key": "",
                                "keyLength": 0
                            }, {
                                "entryMethod": 0,
                                "key": "",
                                "keyLength": 0
                            }, {
                                "entryMethod": 0,
                                "key": "",
                                "keyLength": 0
                            }]
                        },
                        "wpa": {
                            "encryptionAlgorithm": 0,
                            "groupKeyUpdateInterval": 3600,
                            "groupKeyUpdateIntervalEnabled": true,
                            "key": "Verizon123",
                            "type": 1
                        }
                    }
                }, {
                    "channelDesired": 0,
                    "channelUsed": 0,
                    "enabled": false,
                    "mode": 0,
                    "pathID": "guest1",
                    "radioFreq": -1,
                    "rxPackets": 0,
                    "ssid": "FiOS-3ULZR-Guest",
                    "ssidBroadcast": false,
                    "txPackets": 0,
                    "wmm": false,
                    "security": {
                        "enabled": true,
                        "type": 1,
                        "wep": null,
                        "wpa": {
                            "encryptionAlgorithm": 0,
                            "groupKeyUpdateInterval": 0,
                            "groupKeyUpdateIntervalEnabled": false,
                            "key": "myverizon123",
                            "type": 1
                        }
                    }
                }, {
                    "channelDesired": 0,
                    "channelUsed": 0,
                    "enabled": false,
                    "mode": 0,
                    "pathID": "guest2",
                    "radioFreq": -1,
                    "rxPackets": 0,
                    "ssid": "FiOS-3ULZR-Guest",
                    "ssidBroadcast": false,
                    "txPackets": 0,
                    "wmm": false,
                    "security": null
                }]
            }
        };

        if (responseData != "")
            callback(responseData);
        else
            callback('ERROR');

        console.log("getWifi api call completed...");
    } catch (err) {
        console.log("Error found in getRouter call : " + err);
        callback('ERROR');
    }
}

//handle network access getIpDevices
function HandleProgramSearch(intent, session, callback) {
    var speechOutput = "What program type are you looking for. you can ask by saying, romantic or drama.";
    var repromptText = "Please tell me your question by saying, yes or no to block or unblock the device.";

    session.attributes.lastspeech = speechOutput;
    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, false));
}

//handle wifi information
function ShowProgramList(intent, session, callback) {
    var speechOutput = "Sorry! unable to find your program. Please try again by saying network type.";
    var repromptText = "Sorry! unable to find your program details. Please try again by saying network type.";

    console.log("Slot name : ", intent.slots.ProgramType.value);
    if (intent.slots.ProgramType.value == "romantic") {
        getRomanticProgramList(intent, session, function(data) {
            if (data != 'ERROR') {
                speechOutput = "There are 3 programs available at this time, say <break time='1s'/> yes to watch <break time='1s'/> or next to move to next program. <break time='1s'/> do you want to Watch <break time='1s'/> " + session.attributes[session.attributes["DISPLAY_ITEM_COUNT"]].name;
            } else {
                speechOutput = repromptText;
            }
        });
    } else if (intent.slots.ProgramType.value == "drama") {
        getDramaProgramList(intent, session, function(data) {
            if (data != 'ERROR') {
                speechOutput = "There are 3 programs available at this time, say <break time='1s'/> yes to watch <break time='1s'/> or next to move to next program. <break time='1s'/> do you want to Watch <break time='1s'/> " + session.attributes[session.attributes["DISPLAY_ITEM_COUNT"]].name;
            } else {
                speechOutput = repromptText;
            }
        });
    }
    session.attributes.lastspeech = speechOutput;
    callback(session.attributes, buildSSMLSpeechletResponse("program", speechOutput, repromptText, false));
}

//get list of romantic programs
function getRomanticProgramList(intent, session, callback) {
    var responseData = "";

    responseData = {
        "program": [{
            name: "You've got mail",
            channelName: "HBO",
            time: "7.45 pm"
        }, {
            name: "Love Actually",
            channelName: "HBO",
            time: "8 pm"
        }, {
            name: "Sleepless in seattle",
            channelName: "HBO",
            time: "8.30 pm"
        }]
    };
    var i = 0;
    var list_of_programs = responseData.program;
    list_of_programs = Array.isArray(list_of_programs) ? list_of_programs : JSON.parse("[" + JSON.stringify(list_of_programs) + "]");
    console.log("List of devices  : ", list_of_programs);
    //for(var item in list_of_programs)
    list_of_programs.forEach(function(item) {
        console.log("Item : ", item);
        session.attributes[i] = item;
        console.log("New Item added : ", session.attributes[i]);
        i++;
    });
    session.attributes["ITEM_COUNT"] = i;
    session.attributes.currentintent = "GetRomanticProgram";
    session.attributes["DISPLAY_ITEM_COUNT"] = 0;
    console.log("Total Item Count : ", session.attributes["ITEM_COUNT"]);
    if (responseData != "")
        callback(responseData);
    else
        callback('ERROR');
}

//get list of programs
function getDramaProgramList(intent, session, callback) {
    var responseData = "";

    responseData = {
        "program": [{
            name: "Logan",
            channelName: "HBO",
            time: "7.45 pm"
        }, {
            name: "Ghost in the shell",
            channelName: "HBO",
            time: "8 pm"
        }, {
            name: "Gifted",
            channelName: "HBO",
            time: "8.30 pm"
        }]
    };
    var i = 0;
    var list_of_programs = responseData.program;
    list_of_programs = Array.isArray(list_of_programs) ? list_of_programs : JSON.parse("[" + JSON.stringify(list_of_programs) + "]");
    console.log("List of devices  : ", list_of_programs);
    //for(var item in list_of_programs)
    list_of_programs.forEach(function(item) {
        console.log("Item : ", item);
        session.attributes[i] = item;
        console.log("New Item added : ", session.attributes[i]);
        i++;
    });
    session.attributes["ITEM_COUNT"] = i;
    session.attributes.currentintent = "GetRomanticProgram";
    session.attributes["DISPLAY_ITEM_COUNT"] = 0;
    console.log("Total Item Count : ", session.attributes["ITEM_COUNT"]);
    if (responseData != "")
        callback(responseData);
    else
        callback('ERROR');
}

//handle next program
function HandleNextProgram(intent, session, callback) {
    var speechOutput = "Please tell me your question by saying, <break time='1s'/> yes to watch the program <break time='1s'/> or next to move to next program.";
    var repromptText = "Please tell me your question by saying, <break time='1s'/> yes to watch the program <break time='1s'/> or next to move to next program.";
    console.log("Increased index by 1");
    session.attributes["DISPLAY_ITEM_COUNT"] = parseInt(session.attributes["DISPLAY_ITEM_COUNT"]) + 1;

    if (parseInt(session.attributes["ITEM_COUNT"]) <= parseInt(session.attributes["DISPLAY_ITEM_COUNT"])) {
        console.log("Chnaged value to zero again...");
        session.attributes["DISPLAY_ITEM_COUNT"] = 0;
    }

    console.log("Display count value : ", session.attributes["DISPLAY_ITEM_COUNT"]);
    console.log("Display item value : ", session.attributes[session.attributes["DISPLAY_ITEM_COUNT"]]);
    speechOutput = "Do you want to watch the program " + session.attributes[session.attributes["DISPLAY_ITEM_COUNT"]].name;
    session.attributes.lastspeech = speechOutput;
    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, false));
}

//handle watch program list
function HandleWatchProgram(intent, session, callback) {
    var speechOutput = "Tunning your TV to " + session.attributes[session.attributes["DISPLAY_ITEM_COUNT"]].name;
    var shouldEndSession = false;
    var repromptText = "Tunning your TV to " + session.attributes[session.attributes["DISPLAY_ITEM_COUNT"]].name;
    callback(session.attributes, buildSSMLSpeechletResponse('Error response', speechOutput, repromptText, shouldEndSession));
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {

    console.log('Inside buildSpeechletResponseWithoutCard');
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSSMLSpeechletResponse(title, output, repromptText, shouldEndSession) {
    console.log('Inside buildSSMLSpeechletResponse ' + output);
    return {
        outputSpeech: {
            type: 'SSML',
            ssml: '<speak>' + output + '</speak>',
        },
        card: {
            type: 'Simple',
            title: title,
            content: output,
        },
        reprompt: {
            outputSpeech: {
                type: 'SSML',
                ssml: '<speak>' + repromptText + '</speak>',
            },
        },
        "shouldEndSession": shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    console.log('Inside buildResponse');
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}