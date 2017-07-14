/**
 
 Copyright 2016 Brian Donohue.
 
*/
'use strict';
const Alexa = require('alexa-sdk');
var http = require('http');
var https = require('https');
var request = require('request');

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL)

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function(event, context) {
    try {
        console.log("Inside the exports handlers of event and context")
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

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
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Get Wi-fi information';
    const speechOutput = 'Welcome to the Verizon. ' + 'Please tell me your question we will answer';
    const repromptText = 'Please tell me your question by saying, ' + 'my network information';
    const shouldEndSession = false;

    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));

}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log('Inside onIntent');
    console.log("onIntent requestId = " + intentRequest.requestId + ", sessionId = " + session.sessionId);

    var intent = intentRequest.intent;
    var intentName = intentRequest.intent.name;

    console.log("onIntent Intent Name " + intentName);

    if (intentName == 'GetWifiInfo') {
        HandleGetWifiInfoIntent(intent, session, callback);
    } else if (intentName == 'GetWifiDetails') {
        HandleGetWifiInformationIntent(intent, session, callback);
    } else if (intentName == 'GetRouterInfo') {
        HandleGetRouterInfromationIntent(intent, session, callback);
    } else if (intentName == 'RebootRouter') {
        HandleRebootRouterIntent(intent, session, callback);
    } else if (intentName == 'SpeedTest') {
        HandleSpeedtestInformation(intent, session, callback);
    } else if (intentName === 'BHRHelp') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(intent, session, callback);
    } else {
        throw "Invalid intent";
    }
}

//handle session end request
function handleSessionEndRequest(intent, session, callback) {
    var speechOutput = "Thank you for trying verizon BHR router Skills. Hava a nice day!";
    var repromptText = "Please tell me your question by saying, reboot router.";

    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, true));
}

function HandleSpeedtestInformation(intent, session, callback) {
    var speechOutput = "Your upload speed is 70 mbps and downlaod speed is 85 mbps.";
    var repromptText = "Please tell me your question by saying, run SpeedTest.";

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
    var speechOutput = "An error found";
    var repromptText = "Please tell me your question by saying, my router details";
    getRouterJSON(function(data) {
        if (data != 'ERROR') {
            speechOutput = "Router serial number is  " + data.serialNo + ", type is " + data.type + " and ip is " + data.ip;
        } else {
            speechOutput = repromptText;
        }
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

//handle wifi information
function HandleGetWifiInfoIntent(intent, session, callback) {
    var speechOutput = "Which network details are you looking for, primary, secondary or guest network?";
    var repromptText = "Please tell me your question by saying, my network details";

    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, false));
}


//handle wifi information
function HandleGetWifiInformationIntent(intent, session, callback) {
    var speechOutput = "An error found";
    var repromptText = "Please tell me your question by saying, my Wifi details";
    getJSON(function(data) {
        if (data != 'ERROR') {
            console.log("Slot name : ", intent.slots.NetworkType.value);
            if (intent.slots.NetworkType.value == "primary")
                speechOutput = "Wi-Fi Information for 2.4GHz network, Wifi name is " + data.body.nodes[0].ssid + " and password is " + data.body.nodes[0].security.wpa.key;
            else if (intent.slots.NetworkType.value == "secondary")
                speechOutput = "Wi-Fi Information for 5GHz network, Wifi name is " + data.body.nodes[1].ssid + " and password is " + data.body.nodes[1].security.wpa.key;
            else if (intent.slots.NetworkType.value == "guest")
                speechOutput = "Wi-Fi Information for Guest network, Wifi name is " + data.body.nodes[2].ssid + " and password is " + data.body.nodes[2].security.wpa.key;
            else
                speechOutput = "Not sure what exactly you are looking for";
        } else {
            speechOutput = repromptText;
        }
        callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, false));
    });
}

//get wifi details
function getJSON(callback) {
    console.log("getWifi API call triggered");
    try {

        var options = {
            host: 'www98.verizon.com',
            port: 443,
            path: '/FQG/BHRAPIHandler.aspx?',
            method: 'GET',
            headers: {accept: '*/*'}
        };

        var req = https.request(options, function(res) {
            console.log(res.statusCode);
            res.on('data', function(d) {
                process.stdout.write(d);
                console.log("d : ", d);
                var responseData = d;
                if (responseData != "")
                    callback(responseData);
                else
                    callback('ERROR');

            });
        });
        req.end();

        req.on('error', function(e) {
            console.error(e);
        });

    } catch (experr) {
        console.log('catch error on getWifi api call :- ' + experr);
    }
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    console.log('Inside buildSpeechletResponseWithoutCard');
    return {
        outputSpeech: {
            type: "SSML",
            ssml: '<speak>' + output + '</speak>'
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

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
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