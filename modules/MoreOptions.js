// MoreOptions.js
var MoreOptions = function () { };

MoreOptions.prototype.doMoreOptions = function (req, res) {

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

exports.MoreOptions = new MoreOptions();