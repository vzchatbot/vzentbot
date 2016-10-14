var restify = require('restify');
var builder = require('botbuilder');
var apiai = require('apiai');
var app = apiai("19c8bad1930f4e28ad3527a8a69fda04");

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: '31c8d108-cdc4-4474-8e08-c2f6a3b54364',
    appPassword: 'm5JLXWcRfymrNfHTta454Qj'
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
       var options = {
		sessionId: '9f04e63b-9ca6-4243-95ef-936be5a94g12'
				}

	var request = app.textRequest(session.message.text, options);
    
    
    request.on('response', function (response) {

        var intent = response.result.action;
//console.log(JSON.stringify(response));
        
session.send(response.result.fulfillment.speech);

		session.send(response.result.fulfillment.speech.data);

		var msg = new builder.Message(session).sourceEvent({

			
facebook: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "receipt",
                            recipient_name: "Stephane Crozatier",
                            order_number: "12345678902",
                            currency: "USD",
                            payment_method: "Visa 2345",        
                            order_url: "http://petersapparel.parseapp.com/order?order_id=123456",
                            timestamp: "1428444852", 
                            elements: [
                                {
                                    title: "Classic White T-Shirt",
                                    subtitle: "100% Soft and Luxurious Cotton",
                                    quantity: 2,
                                    price: 50,
                                    currency: "USD",
                                    image_url: "http://petersapparel.parseapp.com/img/whiteshirt.png"
                                },
                                {
                                    title: "Classic Gray T-Shirt",
                                    subtitle: "100% Soft and Luxurious Cotton",
                                    quantity: 1,
                                    price: 25,
                                    currency: "USD",
                                    image_url: "http://petersapparel.parseapp.com/img/grayshirt.png"
                                }
                            ],
                            address: {
                                street_1: "1 Hacker Way",
                                street_2: "",
                                city: "Menlo Park",
                                postal_code: "94025",
                                state: "CA",
                                country: "US"
                            },
                            summary: {
                                subtotal: 75.00,
                                shipping_cost: 4.95,
                                total_tax: 6.19,
                                total_cost: 56.14
                            },
                            adjustments: [
                                { name: "New Customer Discount", amount: 20 },
                                { name: "$10 Off Coupon", amount: 10 }
                            ]
                        }
                    }
                }

		});

console.log(JSON.stringify(msg));
		session.send(msg);
      
        

    });

    request.on('error', function (error) {
        console.log(error);
    });
    
    request.end()

   
});
