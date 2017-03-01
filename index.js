
/*var five = require("johnny-five");

var board = new five.Board();
var led;

board.on("ready", function() {
    led = new five.Led(12);
});

var express    = require('express');       
var app        = express();
var router = express.Router(); 
router.get('/on', function(req, res) { 
    led.on();
    res.json({ message: 'on' });  

});
router.get('/off', function(req, res) {  
    led.off();
    res.json({ message: 'off' }); 

});
app.use('/api', router);
app.listen(8090);
console.log('Magic happens on port ' + port);
*/
pixel = require("node-pixel");
five = require("johnny-five");

var board = new five.Board();
var strip = null;

board.on("ready", function() {

    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        strips: [ {pin: 6, length: 4}, {pin: 8, length: 4},  {pin: 10, length: 4}, ], // this is preferred form for definition
       // gamma: 2.8, // set to a gamma that works nicely for WS2812
    });

    strip.on("ready", function() {
        // do stuff with the strip here.
        strip.color([25, 25, 0]); // Sets strip using an array
strip.show();
        console.log(strip);
    });
        console.log("strip");
});