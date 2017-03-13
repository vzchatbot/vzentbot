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
	exports.handler = function (event, context) {
    try {
		
		console.log("Inside the exports handlers of event and context")	
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);
		console.log("Request info " + JSON.stringify(event));
		
        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
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
			
			onIntent(event.request,event.session,
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
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Good Bye';
    //const speechOutput = 'Thank you for trying the Verizon F\'yos. Good Bye! Have a nice day!';
	const speechOutput = "Okay! Thank you for trying the Verizon F\'yos. I am there to help you any time. " + 
						 "Remember You can also ask me anytime by saying <break time='1s'/> What is my bill , <break time='1s'/> Or My Internet is slow or  <break time='1s'/> " + 
						 "or any other support related queries Good Bye! Have a nice day!";
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSSMLSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session,callback) {
    console.log('onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}');

    // Dispatch to your skill's launch.
    //wakeupfios(callback);
	var visionCustID='154190083';
	   var BTN ='7328422487';
	   var State = 'NJ';
	   
	   
		getDashboardinformation(visionCustID, BTN, State,function (str) { getDashboardinformationCallback(str, session, callback) });
}

function wakeupfios(callback){
	
	console.log("get wakeup Called");
	
	var shouldEndSession = false; 
	var repromptText = 'Are you still there? <break time="1s"/> What can i help you with? <break time="1s"/> To Get Started, you can say "What\'s in F\'Yos? Or say wake up F\'Yos.'; 
	//var speechOutput = 'Welcome to F\'yos. <break time="1s"/>Today I see you have one alert which you need to take care. <break time="1s"/> say Alert to provide information on your alert <break time="1s"/> or Just say Stop.';
	var speechOutput = 'Welcome to F\'Yos. <break time="1s"/> What can i help you with?. To Get Started, you can say "What\'s in F\'Yos? Or wake up F\'Yos';
	var cardTitle ="Wake up Fios";
	
	var sessionAttributes = 
		{
			"currentintent" : "onlaunch",
			"speechOutput": speechOutput,
			"repromptText" : repromptText,
			"SlowspeedCurrentStep":'',
			"SlowspeedStep1": 'Ok, Let\'s start <break time="5ms"/> Reboot your router by unplugging the power cord from the electrical outlet and <break time="1s"/> wait for 10 seconds before reconnecting and test your internet speed. <break time="2s"/> Please say YES if your issue is fixed or say NO to continue next troubleshooting step.',
			"SlowspeedStep2" :'Ok, Let\'s do next step of troubleshoot, <break time="5ms"/> To rule out possible Wi-Fi interference, <break time="1s"/> move with 10 feet of your router to test your internet speed.<break time="2s"/> Please say YES if your issue is fixed or say NO to continue next troubleshooting step.',
			"SlowspeedStep3" :'Ok, Let\'s do next step of troubleshoot, <break time="5ms"/> Your Internet usage could be at capacity. <break time="1s"/> If you are streaming several videos simultaneously, for example, it could cause your connection to slow down. <break time="1s"/> Can you stop streaming videos and test your internet speed. <break time="2s"/> Please say YES if your issue is fixed or say NO to continue next troubleshooting step.',
			"SlowspeedStep4" :'Ok, Let\'s do final step of troubleshoot, <break time="5ms"/>Surfing over a Virtual Private Network alias VPN can result in slower speeds. A VPN is needed to connect to your company\'s intranet. <break time="1s"/> Can you temporarily disconnect from the VPN and test your internet speed. <break time="2s"/> Please say YES if your issue is fixed or say NO to continue next troubleshooting step',
			"SlowspeedIsTBLStarted":"NO",
			"BBUTBKStarted":"NO",
			"ReplaceOrTBLQue":"YES",
			"deliveryQuestion" :"",
			"DashboardInfo" : "",
			"previousintent" : "",
			"lastspeech":speechOutput,
			"lastreprompt":repromptText,
			"ONTprice":""
		}
	
						
	
	callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    
	console.log("get wakeup completed");
	
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
	console.log('Inside onIntent'); 
    console.log("onIntent requestId=" + intentRequest.requestId  + ", sessionId=" + session.sessionId);
	console.log("onIntent Intent Name " + intentRequest.intent.name); 
    
	var intent = intentRequest.intent;
    var intentName = intentRequest.intent.name;
	let shouldEndSession = false;
	var sessionAttributes = {};
	var repromptText = null;
	let speechOutput = '';
	var cardTitle = '';
	var sender = '945495155552625';
      
   if(intentName == 'BillEnquiry') {
	   
	   if(session.new)
	   {
		   console.log("Bill Enquiry New Session");
		   sessionAttributes = 
			{
				"currentintent" : intentName,
				"speechOutput": speechOutput,
				"repromptText" : repromptText,
				"SlowspeedCurrentStep":'',
				"SlowspeedStep1": 'Ok, Let\'s start <break time="5ms"/> Reboot your router by unplugging the power cord from the electrical outlet and <break time="1s"/> wait for 10 seconds before reconnecting and test your internet speed. <break time="2s"/> Please say YES if your issue is fixed or say NO to continue next troubleshooting step.',
				"SlowspeedStep2" :'Ok, Let\'s do next step of troubleshoot, <break time="5ms"/> To rule out possible Wi-Fi interference, <break time="1s"/> move with 10 feet of your router to test your internet speed.<break time="2s"/> Please say YES if your issue is fixed or say NO to continue next troubleshooting step.',
				"SlowspeedStep3" :'Ok, Let\'s do next step of troubleshoot, <break time="5ms"/> Your Internet usage could be at capacity. <break time="1s"/> If you are streaming several videos simultaneously, for example, it could cause your connection to slow down. <break time="1s"/> Can you stop streaming videos and test your internet speed. <break time="2s"/> Please say YES if your issue is fixed or say NO to continue next troubleshooting step.',
				"SlowspeedStep4" :'Ok, Let\'s do final step of troubleshoot, <break time="5ms"/>Surfing over a Virtual Private Network alias VPN can result in slower speeds. A VPN is needed to connect to your company\'s intranet. <break time="1s"/> Can you temporarily disconnect from the VPN and test your internet speed. <break time="2s"/> Please say YES if your issue is fixed or say NO to continue next troubleshooting step',
				"SlowspeedIsTBLStarted":"NO",
				"BBUTBKStarted":"NO",
				"ReplaceOrTBLQue":"YES",
				"deliveryQuestion" :"",
				"DashboardInfo" : "",
				"previousintent" : '',
				"lastspeech":speechOutput,
				"lastreprompt":repromptText,
				"ONTprice":""
			}
	   }
	   else
	   {
		   console.log("Bill Enquiry Old Session");
		   session.attributes.previousintent = session.attributes.currentintent;
		   session.attributes.currentintent = intentName;
		   sessionAttributes = session.attributes;
		   console.log("Old Session in bill enquiry " + JSON.stringify(session));
		   
	   }
	   
	  showBillInfo(sender, function (str) { showBillInfoCallback(str, sender, callback) });
   }
   /*else if (intentName == 'OpenTicket')   {
    showopentickets(sender, function (str) { showopenticketsCallback(str, sender, callback) });
   }*/
   else if (intentName == 'slowspeed')   {
    //slowspeed(callback);
	console.log("Slow Speed Intent");
	
	speechOutput = 'I can offer you some troubleshooting steps which can resolve your slow internet. Just say yes to start the troubleshooting <break time="1s"/> or just say Stop.';
	repromptText =  'Say yes to start troubleshooting of your slow internet <break time="1s"/> or just say stop';
	
		sessionAttributes = 
		{
			"currentintent" : intentName,
			"speechOutput": speechOutput,
			"repromptText" : repromptText,
			"SlowspeedCurrentStep":'',
			"SlowspeedStep1": 'Ok, Let\'s start <break time="5ms"/> Reboot your router by unplugging the power cord from the electrical outlet and <break time="1s"/> wait for 10 seconds before reconnecting and test your internet speed. <break time="2s"/> Please say YES if your issue is fixed or say NO to continue next troubleshooting step.',
			"SlowspeedStep2" :'Ok, Let\'s do next step of troubleshoot, <break time="5ms"/> To rule out possible Wi-Fi interference, <break time="1s"/> move with 10 feet of your router to test your internet speed.<break time="2s"/> Please say YES if your issue is fixed or say NO to continue next troubleshooting step.',
			"SlowspeedStep3" :'Ok, Let\'s do next step of troubleshoot, <break time="5ms"/> Your Internet usage could be at capacity. <break time="1s"/> If you are streaming several videos simultaneously, for example, it could cause your connection to slow down. <break time="1s"/> Can you stop streaming videos and test your internet speed. <break time="2s"/> Please say YES if your issue is fixed or say NO to continue next troubleshooting step.',
			"SlowspeedStep4" :'Ok, Let\'s do final step of troubleshoot, <break time="5ms"/>Surfing over a Virtual Private Network alias VPN can result in slower speeds. A VPN is needed to connect to your company\'s intranet. <break time="1s"/> Can you temporarily disconnect from the VPN and test your internet speed. <break time="2s"/> Please say YES if your issue is fixed or say NO to continue next troubleshooting step',
			"SlowspeedIsTBLStarted":"NO",
			"BBUTBKStarted":"NO",
			"ReplaceOrTBLQue":"YES",
			"deliveryQuestion" :"",
			"DashboardInfo" : "",
			"previousintent" : session.attributes.currentintent,
			"lastspeech":speechOutput,
			"lastreprompt":repromptText,
			"ONTprice":""
		}
	
	
	shouldEndSession = false;
	cardTitle = 'Slow Speed';
	//callback(sessionAttributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
	callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
   }
   else if (intentName == 'moreoptions')   {
    	console.log('More Options');
		speechOutput = 'You can also ask <break time="1s"/> My Internet is slow, <break time="1s"/> NO Picture <break time="1s"/> any other support related queries.';
		shouldEndSession = true;
		repromptText = null;
		sessionAttributes = {};
		callback(sessionAttributes, buildSSMLSpeechletResponse('Bill Enquiry', speechOutput, repromptText, shouldEndSession));
   }
   else if(intentName == 'AMAZON.StartOverIntent'){
	   wakeupfios(callback);
   }
   else if (intentName == 'AMAZON.StopIntent' || intentName == 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
   }
   else if (intentName == 'AMAZON.YesIntent' || intentName == 'confirm') {
        //handleSessionEndRequest(callback);
		console.log('Get the intent from session ' + JSON.stringify(session));
		if(session.attributes){
			if(session.attributes.currentintent) {
				if(session.attributes.currentintent == 'slowspeed'){
					if(session.attributes.IsTBLStarted == 'YES'){
						speechOutput = 'Congrats ! You have sucessfully fixed the slow internet issue. please say "Start Verizon" for any further help';
						shouldEndSession = true;
						repromptText = null;
						sessionAttributes = {};
						callback(sessionAttributes, buildSSMLSpeechletResponse('Congrats', speechOutput, repromptText, shouldEndSession));
					}
					else{
						repromptText = session.attributes.repromptText;
						speechOutput = session.attributes.SlowspeedStep1;
						session.attributes.CurrentStep = 'Step1';
						cardTitle = 'Router Reboot';
						session.attributes.IsTBLStarted = 'YES';
						sessionAttributes = session.attributes;
						callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
					}
				}
				else if(session.attributes.currentintent == 'RTCI'){
					
					session.attributes.previousintent = session.attributes.currentintent;
					
					if(session.attributes.DashboardInfo != '') {
						
							console.log('dashboard information is not played');
						
							speechOutput = session.attributes.DashboardInfo;
							repromptText = "Are you still there? Can you tell me whether do you want to replace your battery back up unit?";
							cardTitle = 'Fios Information';
							session.attributes.DashboardInfo = '';
							session.attributes.lastspeech = speechOutput;
							session.attributes.lastreprompt = speechOutput;
							session.attributes.speechOutput = speechOutput;
							session.attributes.repromptText = repromptText;	
							sessionAttributes = session.attributes;
							shouldEndSession = false;
							callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
					}
					else if(session.attributes.ordercomplete == "YES"){
						console.log('Order Completed and informing the order number');
						repromptText = "Are you there! here is your order number it says <say-as interpret-as='spell-out'>NJ20001367542</say-as>. <break time='1s'/> You will get an order confirmation mail to your registered mail address with verizon. Thank you for using fios";
						speechOutput = "Okay! here is your order number it says <say-as interpret-as='spell-out'>NJ20001367542</say-as>. <break time='1s'/> You will get an order confirmation mail to your registered mail address with verizon. Thank you for using fios";
						shouldEndSession = true;
						cardTitle = 'Order Confirmation';
						callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
					
					}					
					// else if(session.attributes.BBUTBKStarted == 'YES' && session.attributes.ReplaceOrTBLQue == 'YES' && session.attributes.deliveryQuestion == 'YES'){
						// console.log('BBU Trobleshoot Started = Yes and Question to BBU Troubleshoot = YES and session.attributes.deliveryQuestion == "YES"');
						// speechOutput = 'Congrats! Looks like we are done and i was happy that i helped you to resolve alert <break time="1s"/>Thanks You! Good Bye!';
						// shouldEndSession = true;
						// repromptText = null;
						// sessionAttributes = {};
						// callback(sessionAttributes, buildSSMLSpeechletResponse('Congrats', speechOutput, repromptText, shouldEndSession));
					
					// }
					else if(session.attributes.BBUTBKStarted == 'YES' && session.attributes.ReplaceOrTBLQue == 'YES' && session.attributes.deliveryQuestion == 'NO'){
						console.log('BBU Trobleshoot Started = Yes and Question to BBU Troubleshoot = YES and session.attributes.deliveryQuestion == "NO"');
						speechOutput = 'Congrats! Looks like we are done and i was happy that i helped you to resolve alert <break time="1s"/>Thanks You! Good Bye!';
						shouldEndSession = true;
						repromptText = null;
						sessionAttributes = {};
						callback(sessionAttributes, buildSSMLSpeechletResponse('Congrats', speechOutput, repromptText, shouldEndSession));
					}
					// else if(session.attributes.BBUTBKStarted == 'NO' && session.attributes.questiontoBBUTBL == 'NO'){
					
						// console.log('BBU Trobleshoot Started = NO and Question to BBU Troubleshoot = NO ');
						// speechOutput = 'Okay Before going for replacement, in order to confirm whether alaram is true <break time="1s"/> can we first troubleshoot on your battery back up unit before replacement?';
						// repromptText = 'Are you there! Can we do the troubleshoot first?';
						
						// session.attributes.questiontoBBUTBL = 'YES';
						
						// session.attributes.lastspeech = speechOutput;
						// session.attributes.lastreprompt = speechOutput;
						// session.attributes.speechOutput = speechOutput;
						// session.attributes.repromptText = repromptText;	
						
						// cardTitle = 'Do you want to troubleshoot?';
						// sessionAttributes = session.attributes;
						// shouldEndSession = false;
						// callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
					// }
					// else if(session.attributes.BBUTBKStarted == 'NO' && session.attributes.questiontoBBUTBL == 'YES'){

						// console.log('BBU Trobleshoot Started = NO and Question to BBU Troubleshoot = YES ')
						
						// speechOutput = 'Okay let\'s troubleshoot, <break time="5ms"/> plesae make sure the battery backup unit is plugged directly into a working electrical outlet. ' + 
									   // '<break time="5ms"/> next, reboot the battery backup unit by holding down the alarm silence button for 10 seconds. <break time="5ms"/> this may sometimes clear the false alarm. ' +
									   // '<break time="1s"/> Does your beeping sound stopped?.';
						// repromptText = "Are you there! Does your Battery Back Up Unit Beeping Unit Sound Stopped?";

						// session.attributes.lastspeech = speechOutput;
						// session.attributes.lastreprompt = speechOutput;
						// session.attributes.speechOutput = speechOutput;
						// session.attributes.repromptText = repromptText;			
						
						// session.attributes.BBUTBKStarted = 'YES';
						// session.attributes.deliveryQuestion = 'NO';
						
						// cardTitle = 'Battery Backup Unit Troubleshoot';
						// sessionAttributes = session.attributes;
						// shouldEndSession = false;
						// callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));					
					// }
					else if(session.attributes.deliveryQuestion == "" && session.attributes.ReplaceOrTBLQue == 'YES'){
						
							console.log('Customer asked for direct replace without troubleshoot')
						
						repromptText = "Are you there! Do you want me to place an order for F'\yos <say-as interpret-as='spell-out'>ONT</say-as> battery backup unit?";
						speechOutput = 'Okay! Let\'s replace your F\'yos <say-as interpret-as=\'spell-out\'>ONT</say-as> battery backup unit, <break time="1s"/> the cost of the unit was $39.99. <break time="1s"/> Shall i go head and place an order for F\'yos <say-as interpret-as=\'spell-out\'>ONT</say-as> battery backup unit?';
						
						session.attributes.lastspeech = speechOutput;
						session.attributes.lastreprompt = speechOutput;
						session.attributes.speechOutput = speechOutput;
						session.attributes.repromptText = repromptText;	
						session.attributes.deliveryQuestion = "NEXT";
						session.attributes.BBUTBKStarted = ''
						session.attributes.previousintent = session.attributes.currentintent;
						sessionAttributes = session.attributes;
						shouldEndSession = false;
						cardTitle = 'Battery Back Up Unit Order';
						callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
					}
					else if(session.attributes.deliveryQuestion == "NEXT"){

						console.log('BBU Delivey Options Played')
						
						repromptText = 'Are you there! Can you choose your shipping option(s)? Plesae say Either Premium Shipping Or Economy Shipping or Standard Shipping?';
						speechOutput = 'We have Premium Shipping for One day for $14.99 <break time="1s"/> Or Economy Shipping for two days for $10.99 <break time="1s"/> Or Standard Shipping for 4 to 8 days for $8.99. Can you please tell me which shipping you need?';

						session.attributes.lastspeech = speechOutput;
						session.attributes.lastreprompt = speechOutput;
						session.attributes.speechOutput = speechOutput;
						session.attributes.repromptText = repromptText;				
						
						session.attributes.deliveryQuestion = 'YES';
						
						cardTitle = 'Delivery Options';
						sessionAttributes = session.attributes;
						shouldEndSession = false;
						callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));	
					}
					
				}
				
			}
		}
   } 
   else if (intentName == 'AMAZON.NoIntent' || intentName == 'notconfirm'){
        
		console.log('Get the intent from session - NO  ' + JSON.stringify(session));
		var cardTitle='';
		if(session.attributes){
			if(session.attributes.currentintent) {
				if(session.attributes.currentintent == 'slowspeed'){
					if((session.attributes.CurrentStep == '')){
						repromptText = session.attributes.repromptText;
						speechOutput = session.attributes.SlowspeedStep1;
						session.attributes.CurrentStep = 'Step1';
						cardTitle = 'Router Reboot';

						sessionAttributes = session.attributes;
						shouldEndSession = false;
						callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
						
					}
					else if((session.attributes.CurrentStep == 'Step1')){
						repromptText = session.attributes.repromptText;
						speechOutput = session.attributes.SlowspeedStep2;
						session.attributes.CurrentStep = 'Step2';
						cardTitle = 'Move closer to the router';

						sessionAttributes = session.attributes;
						shouldEndSession = false;
						callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
						
					}
					else if((session.attributes.CurrentStep == 'Step2')){
						repromptText = session.attributes.repromptText;
						speechOutput = session.attributes.SlowspeedStep3;
						session.attributes.CurrentStep = 'Step3';
						cardTitle = 'Stop Video-Audio Streaming';

						sessionAttributes = session.attributes;
						shouldEndSession = false;
						callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
						
					}
					else if((session.attributes.CurrentStep == 'Step3')){
						repromptText = session.attributes.repromptText;
						speechOutput = session.attributes.SlowspeedStep4;
						session.attributes.CurrentStep = 'Step4';
						cardTitle = 'Disconnect from the Virtual Private Network (VPN)';
						
						sessionAttributes = session.attributes;
						shouldEndSession = false;
						callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
					}
					else if((session.attributes.CurrentStep == 'Step4')){
						repromptText = null;
						speechOutput = 'Sorry, we see the steps that you have tried still not resolved your problem. <break time="1s"/> Please talk to our VERIZON Support Agent by calling <say-as interpret-as="telephone">1800.837.4966</say-as> at your convenience. Good Bye';
						session.attributes.CurrentStep = '';
						sessionAttributes = {};
						cardTitle = 'Sorry';
						shouldEndSession=true;
						callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
					}
					
				}
				else if(session.attributes.currentintent == 'RTCI'){
					
					if(session.attributes.previousintent == "onlaunch" && session.attributes.currentintent == 'RTCI'){
						console.log('Customer has some information, but said not to read it now - Lauch and RTCI Calls'); 
							handleSessionEndRequest(callback);
					}
					// else if(session.attributes.previousintent == "" && session.attributes.currentintent == 'RTCI') {
						// console.log('Customer has some information, but said not to read it now - Came directly to RTCI Call'); 
							// handleSessionEndRequest(callback);
					// }
					else if(session.attributes.ordercomplete == "YES"){
						console.log('Order Completed and informing the order number');
						repromptText = "Are you there! here is your order number it says <say-as interpret-as='spell-out'>NJ20001367542</say-as>. <break time='1s'/> You will get an order confirmation mail to your registered mail address with verizon. Thank you for using fios";
						speechOutput = "Okay! here is your order number it says <say-as interpret-as='spell-out'>NJ20001367542</say-as>. <break time='1s'/> You will get an order confirmation mail to your registered mail address with verizon. Thank you for using fios";
						shouldEndSession = true;
						cardTitle = 'Order Confirmation';
						callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
					
					}
					else if(session.attributes.BBUTBKStarted == 'NO' && session.attributes.ReplaceOrTBLQue == 'YES'){

						console.log('BBU Trobleshoot Started = NO and Question to BBU Troubleshoot = YES ')
						
						speechOutput = 'Okay let\'s troubleshoot, <break time="1s"/> plesae make sure the F\'yos <say-as interpret-as=\'spell-out\'>ONT</say-as> battery backup unit is plugged directly into a working electrical outlet. ' + 
									   'next, <break time="1s"/> reboot the battery backup unit by holding down the alarm silence button for 10 seconds. <break time="5ms"/> this may sometimes clear the false alarm. ' +
									   '<break time="1s"/> Does your battery beeping sound stopped?.';
						repromptText = "Are you there! Does your Battery Back Up Unit Beeping Unit Sound Stopped?";

						session.attributes.lastspeech = speechOutput;
						session.attributes.lastreprompt = speechOutput;
						session.attributes.speechOutput = speechOutput;
						session.attributes.repromptText = repromptText;			
						
						session.attributes.BBUTBKStarted = 'YES';
						session.attributes.deliveryQuestion = 'NO';
						
						cardTitle = 'Battery Backup Unit Troubleshoot';
						sessionAttributes = session.attributes;
						shouldEndSession = false;
						callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));					
					}
					else if(session.attributes.deliveryQuestion == "NO"){
						
						repromptText = "Are you there! Do you want me to place an order for F'\yos <say-as interpret-as='spell-out'>ONT</say-as> battery backup unit?";
						speechOutput = "Okay! Let\'s replace your F'\yos <say-as interpret-as='spell-out'>ONT</say-as> battery backup unit, <break time='1s'/> the cost of the unit is $39.99. <break time='1s'/> Shall i go head and place an order?";
						
						session.attributes.lastspeech = speechOutput;
						session.attributes.lastreprompt = speechOutput;
						session.attributes.speechOutput = speechOutput;
						session.attributes.repromptText = repromptText;	
						session.attributes.deliveryQuestion = "NEXT";
						session.attributes.previousintent = session.attributes.currentintent;
						sessionAttributes = session.attributes;
						shouldEndSession = false;
						cardTitle = 'Battery Back Up Unit Order';
						callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
					}
					else if(session.attributes.deliveryQuestion == "NEXT"){
						console.log('Asked the question for ORder, but told not to order');
						handleSessionEndRequest(callback);
					}
					
					else{
						console.log('Customer not interested to order'); 
							handleSessionEndRequest(callback);
					}
						
					
					
				}
			}  
		}
   }
   else if (intentName == 'RTCI') {
	   
	   console.log("Start Inside RTCI Intent");
	   
	   var visionCustID='154190083';
	   var BTN ='7328422487';
	   var State = 'NJ';
	   
	   if(intentRequest.intent.slots.BBUDelivery.value){
	
		var DeliveryOption = intentRequest.intent.slots.BBUDelivery.value;
		console.log("DeliveryTime of BBU " + DeliveryOption );
		
		BBUOrder(DeliveryOption, visionCustID, BTN, State,function (str) { BBUOrderCallback(DeliveryOption,str, callback, session) });
		
	   }
	   else {
	    console.log("Slot Value is empty");
		getDashboardinformation(visionCustID, BTN, State,function (str) { getDashboardinformationCallback(str, session, callback) });
	   }
	   console.log("Completed Inside RTCI Intent");
   }
   else if (intentName == 'AMAZON.RepeatIntent'){
		
		console.log('Repeat Intent');
		speechOutput = session.attributes.lastspeech;
		shouldEndSession = false;
		repromptText = session.attributes.lastreprompt;
		sessionAttributes = session.attributes;
		callback(sessionAttributes, buildSSMLSpeechletResponse('Repeat', session.attributes.lastspeech, session.attributes.lastreprompt, shouldEndSession));
   }
   else {
        throw new Error('Invalid intent');
    }
 
}

function BBUOrder(DeliveryTime, visionCustID, BTN, State,callback) {
	
console.log("BBUOrder Called");

var shippingOpt="1";

	if(DeliveryTime == 'premium')
		shippingOpt = '1';
	else if(DeliveryTime == 'economy')
		shippingOpt = '2';
	else 
		shippingOpt = '3';


	try
	{

		var args = {
            json: {
					source:"Alexa",
					btn:BTN,
					state:State,
					visionCustomerID:visionCustID,
					visionAccountID:"0001",
					orderIntent:"BATTERYBACKUPREPLACEMENTORDER",
					shippingOption:	shippingOpt,
					ban:""
            }
        };	
		
		console.log(" Request for BBUOrder json " + JSON.stringify(args.json));

        request.post({
            url: 'https://www.verizon.com/foryourhome/ordering/services/BatteryReplacemnetOrder',
            proxy: '',
            headers: {'content-type':'application/json'},
            method: 'POST',
            json: args.json
        },
            function (error, response, body) {
				
				//console.log('Called the callback now response' + response)
				//console.log('Called the callback now body ' + body)		
				
                if (!error && response.statusCode == 200) {
					
					console.log('Called the callback now BBU Order ' + JSON.stringify(body))	
                    callback(body);
                }
                else {
                    
                    console.log('error on callback for bbuordercallback : ' + error);
                }
            }
        );
	}
	catch(err)
	{
		console.log("Error while posting the BBU Order " + err);
	}
	
	console.log("BBUOrder completed");
}

function BBUOrderCallback(DeliveryTime, resp,callback, session){
	console.log("BBUOrderCallback Started");
    objToJson = resp;
	var objToJson = {};
	var repromptText = ""; 
	var sessionAttributes = {}; 
	var shouldEndSession = false; 
	var speechOutput = "";
	let title = "BBU Order Success";
	try
	{
		//speechOutput = 'Congrats! <break time="1s"/> We have received your order with '+DeliveryTime+' delivery option. <break time="1s"/> Once we submit your order we will send order confirmation e-mail to your registered mail address with Verizon. <break time="1s"/> Thank You! Good Bye!';
		shouldEndSession = false;

		speechOutput = 'Congrats! <break time="1s"/> We have received your order with '+DeliveryTime+' delivery option. <break time="1s"/> Can you please note down the order number for future reference.';
		repromptText = 'Can you please note down your order number for future reference with Verizon';

		session.attributes.lastspeech = speechOutput;
		session.attributes.lastreprompt = repromptText;
		session.attributes.speechOutput = speechOutput;
		session.attributes.repromptText = repromptText;
		session.attributes.ordercomplete = "YES";
		sessionAttributes = session.attributes;
		callback(sessionAttributes, buildSSMLSpeechletResponse(title, speechOutput, repromptText, shouldEndSession));
	}
	catch(Err)
	{
		console.log('Error on BBUOrder Callback' + err);
	}
	
	console.log("BBUOrderCallback Completed");
}

function getDashboardinformation(visionCustID, BTN, State,callback){
	
	console.log('start getDashboardinformation');
	
	try {
		//var sender = '945495155552625';
        var args = {
            json: {
                Flow: 'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',
                Request:
                {
                    ThisValue: 'PPSHAlert',
                    visionCustomerID: visionCustID,
                    visionAccountID: "0001",
					state:State,
					BTN:BTN
                }
            }
        };
		
        console.log(" Request for getDashboardinformation json " + JSON.stringify(args.json));

        request.post({
            url: 'https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx',
            proxy: '',
            headers: {'content-type':'application/json'},
            method: 'POST',
            json: args.json
        },
            function (error, response, body) {
				console.log('Called the callback now ' + JSON.stringify(response));
					console.log('Called the callback now ' + JSON.stringify(body));
                if (!error && response.statusCode == 200) {
					console.log('Called the callback now ' + JSON.stringify(response));
					console.log('Called the callback now ' + JSON.stringify(body));
                    callback(body);
                }
                else {
                    
                    console.log('error on callback for getDashboardinformation : ' + error);
                }
            }
        );
    }
    catch (experr) {
        console.log('error on  getDashboardinformation : ' + experr);
    }
	
	console.log('end getDashboardinformation');
	
}

function getDashboardinformationCallback(apiresp,session,callback){
	
	console.log('start getDashboardinformationCallback');
	
	var objToJson = {};
    objToJson = apiresp;
	var repromptText = ""; 
	var sessionAttributes = {}; 
	var shouldEndSession = false; 
	var speechOutput = "";
	let title = "Dashboard Information";
    
	try {
			
			//var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
			var subflow = 'We have some information';
			
			console.log("Response from getDashboardinformationCallback=" + JSON.stringify(objToJson));
			
			if(subflow != null)
			{
				console.log('We have some information to user');
								
				if(!session.new) {
				
						console.log(" Session Available");
						
						speechOutput = "Okay! I see you have one alert which says your F'\Yos <say-as interpret-as='spell-out'>ONT</say-as> battery backup Unit condition is bad and beeping too. <break time='1s'/> It's time to replace your F'\yos <say-as interpret-as='spell-out'>ONT</say-as> Battery Backup Unit now. <break time='1s'/> Do you want to replace or troubleshoot first?";
						repromptText = "Are you still there? Can you tell me whether you want to replace your f'\yos <say-as interpret-as='spell-out'>ONT</say-as> battery back up unit?";
							
						session.attributes.DashboardInfo = '';
						session.attributes.previousintent = session.attributes.currentintent;
						session.attributes.currentintent = "RTCI";
						session.attributes.lastspeech = speechOutput;
						session.attributes.lastreprompt = repromptText;
						session.attributes.speechOutput = speechOutput;
						session.attributes.repromptText = repromptText;
						session.attributes.ReplaceOrTBLQue = "YES";
						sessionAttributes = session.attributes;
				
				}
				else {
					
					console.log(" Session Not Available");
					
					speechOutput = "Welcome to F'\Yos, <break time='1s'/> I see you have one alert which says your F'\Yos <say-as interpret-as='spell-out'>ONT</say-as> battery backup Unit condition is bad and beeping too. <break time='1s'/> It's time to replace your F'\yos <say-as interpret-as='spell-out'>ONT</say-as> Battery Backup Unit now. <break time='1s'/> Do you want to replace or troubleshoot first?";
					repromptText = "Are you still there? Can you tell me whether you want to replace your F'\yos <say-as interpret-as='spell-out'>ONT</say-as> battery back up unit or first troubleshoot?";
				
					sessionAttributes = 
					{
						"currentintent" : "RTCI",
						"speechOutput": speechOutput,
						"repromptText" : repromptText,
						"SlowspeedCurrentStep":'',
						"SlowspeedStep1": 'Ok, Let\'s start <break time="5ms"/> Reboot your router by unplugging the power cord from the electrical outlet and <break time="1s"/> wait for 10 seconds before reconnecting and test your internet speed. <break time="2s"/> Please say YES if your issue is fixed or say NO to continue next troubleshooting step.',
						"SlowspeedStep2" :'Ok, Let\'s do next step of troubleshoot, <break time="5ms"/> To rule out possible Wi-Fi interference, <break time="1s"/> move with 10 feet of your router to test your internet speed.<break time="2s"/> Please say YES if your issue is fixed or say NO to continue next troubleshooting step.',
						"SlowspeedStep3" :'Ok, Let\'s do next step of troubleshoot, <break time="5ms"/> Your Internet usage could be at capacity. <break time="1s"/> If you are streaming several videos simultaneously, for example, it could cause your connection to slow down. <break time="1s"/> Can you stop streaming videos and test your internet speed. <break time="2s"/> Please say YES if your issue is fixed or say NO to continue next troubleshooting step.',
						"SlowspeedStep4" :'Ok, Let\'s do final step of troubleshoot, <break time="5ms"/>Surfing over a Virtual Private Network alias VPN can result in slower speeds. A VPN is needed to connect to your company\'s intranet. <break time="1s"/> Can you temporarily disconnect from the VPN and test your internet speed. <break time="2s"/> Please say YES if your issue is fixed or say NO to continue next troubleshooting step',
						"SlowspeedIsTBLStarted":"NO",
						"BBUTBKStarted":"NO",
						"ReplaceOrTBLQue":"YES",
						"deliveryQuestion" :"",
						"DashboardInfo" : "",
						"previousintent" : "",
						"lastspeech":speechOutput,
						"lastreprompt":repromptText,
						"ordercomplete":""
					}
				
				}
					
				shouldEndSession = false;
				callback(sessionAttributes, buildSSMLSpeechletResponse(title, speechOutput, repromptText, shouldEndSession));
			}
			else
			{
				console.log('No information to play for customer');
				speechOutput = "Okay! right now I do not have any information from F'\Yos. But still you can say hello to me. Good Bye have a nice day.";
				repromptText = ''
				shouldEndSession = true;
				callback(sessionAttributes, buildSSMLSpeechletResponse(title, speechOutput, repromptText, shouldEndSession));
			}
		}
	catch (experr) {
        console.log('error on  getDashboardinformationCallback callback: ' + experr);
    }
	
	console.log('end getDashboardinformationCallback');
}

function checkMandatoryValuesInSession(intentRequest,intentName){
	console.log("Inside checkMandatoryValuesInSession");
	console.log('Slot Request Value ' + JSON.stringify(intentRequest));
	if(intentRequest.intent.slots.MONTHS){
		if(intentName == 'BillEnquiry'){
			var month = intentRequest.intent.slots.MONTHS.value;
			console.log('Slot Request Value month ' + month + ' values');
			if(month){
				return true;
			}
			else{
				return false;
			}
		}
	}
}

function slowspeed(callback) {

	console.log("slowspeed Called");
	var repromptText = ""; 
	var sessionAttributes = {}; 
	var shouldEndSession = false; 
	var speechOutput = "I have been designed specifically to help Fios customers. However, i can still offer you some troubleshooting steps which can resolve slow internet. Just say yes to start the troubleshooting else no.";
	callback(sessionAttributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
	console.log("slowspeed completed");
}

function showBillInfo(sender, callback) {
    console.log("showBillInfo Called");
    try {

        var args = {
            json: {
                Flow: 'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',
                Request:
                {
                    ThisValue: 'BillInfo',
                    BotProviderId: sender
                }
            }
        };
		
        console.log(" Request for showBillInfo json " + JSON.stringify(args.json));

        request.post({
            url: 'https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx',
            proxy: '',
            headers: {'content-type':'application/json'},
            method: 'POST',
            json: args.json
        },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
					
					console.log('Called the callback now')	
                    callback(body);
                }
                else {
                    
                    console.log('error on callback for showBillInfo : ' + error);
                }
            }
        );
    }
    catch (experr) {
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

			if (subflow != null
				&& subflow.facebook != null
				&& subflow.facebook.text != null && subflow.facebook.text == 'UserNotFound') {
				console.log("showBillInfo subflow " + subflow.facebook.text);
				
				
				//speechOutput = "You dont have any due to Verizon";
				speechOutput = 'Your bill is $250.60 <break time="1s"/> and due on Feb 27th 2017';
				shouldEndSession = true;
				callback(sessionAttributes, buildSSMLSpeechletResponse(title, speechOutput, repromptText, shouldEndSession));
			}
			else {
				//sendFBMessage(senderid, subflow.facebook, userCoversationArr);
				speechOutput = subflow.facebook.text;
				shouldEndSession = true;
				callback(sessionAttributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
			}
			
			
		
		}
	catch (experr) {
        console.log('error on  showBillInfo callback: ' + experr);
    }
	
}

function showopentickets(sender, callback) {

    var args =
        {
            json:
            {
                Flow: 'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',
                Request:
                {
                    ThisValue: 'ShowOpenTicket',
                    BotProviderId: sender
                }
            }
        };

    console.log(" Request for showopentickets " + JSON.stringify(args));

    request.post({
        url: 'https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx',
        proxy: '',
        headers: {'content-type':'application/json'},
        method: 'POST',
        json: args.json
    },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(body);
            }
            else {
                console.log(' error on callback for showOpentickets : ' + error + ' body: ' + JSON.stringify(body));
            }
        }
    );
}

function showopenticketsCallback(apiresp, senderid, callback) {
    var objToJson = {};
    objToJson = apiresp;
	var repromptText = ""; 
	var sessionAttributes = {}; 
	var shouldEndSession = false; 
	var speechOutput = "";
	const cardTitle = 'Ticket Details';
	try
	{
    var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;

    console.log("Response from showopentickets =" + JSON.stringify(subflow));
	speechOutput ='You have one open ticket and your ticket number is <say-as interpret-as="spell-out"> VADWOM4 </say-as> and scheduled on Feb 28th 2017.';
	
    callback(sessionAttributes, buildSSMLSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
	
	/*if (subflow != null
        && subflow.facebook != null
        && subflow.facebook.text != null && subflow.facebook.text == 'UserNotFound') {
        console.log("showOutagetickets subflow " + subflow.facebook.text);
        
		speechOutput = "No we dont have any tickets in your account";

    }
    else {
       
    }*/
	}
	catch(erre)
	{
		console.log("Exception in showopenticketscallback " + erre);
	}

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
            ssml: '<speak>' + output+'</speak>',
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
        "shouldEndSession":shouldEndSession
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
