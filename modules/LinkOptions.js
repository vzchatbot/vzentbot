// LinkOptions.js
var LinkOptions = function () { };

LinkOptions.prototype.doLinkOptions = function (req, res) {

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

exports.LinkOptions = new LinkOptions();