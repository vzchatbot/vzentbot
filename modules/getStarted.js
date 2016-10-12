// getStarted.js
var getStarted = function () { };

getStarted.prototype.dogetStarted = function (req, res) {

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

}

exports.getStarted = new getStarted();