// welcome.js
var Welcome = function () { };

Welcome.prototype.doWelcome = function (req, res) {

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

exports.Welcome = new Welcome();