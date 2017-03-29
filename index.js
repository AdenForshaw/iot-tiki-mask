
var express    = require('express');       
var app        = express();
var router = express.Router(); 
var config = require('./config.json');

//required to detect if raspi or not
 var os = require('os');

//Audio on dev machine (mac osx)
var player = require('play-sound')(opts = {})
//Audio for RasPi or Linux etc with omxplayer installed
var Omx = require('node-omxplayer');

//LED animations
var blinker;
var currentAction;


function startAction(action)
{
    console.log("method",'startAction',action);
    
    currentAction = action;
    //stop everything
    stopAction()
    //play audio
    if(action.sound)playSound(action.sound);
    //start leds - 
    startLEDs();
    //set timeout based on duration
    setTimeout(onActionTimeout,action.duration);
}

function stopAction()
{
    clearInterval(blinker);
    strip.off();
}

function onActionTimeout()
{
    console.log("debug","onActionTimeout");
    stopAction();
}

function playSound(fileName)
{
    //quick hack to determine if demoed on RasPi or not
    if(os.platform()=='linux')
    {
        // Create an instance of the player with the source
        var tPlayer = Omx(fileName);
        tPlayer.on('error', function(err){
            if (err) throw err
        })
    }else{
        player.play(fileName, function(err){
            if (err) throw err
        })
    }
}

function startLEDs()
{
    var fps = 30;

    switch(currentAction.animation)
    {
        case "mexican-wave":
            var colors = currentAction.colour;//["red", "green", "blue"];
            var current_colors = [0,1,2];
            var pixel_list = [0,1,2];
            blinker = setInterval(function() {

                strip.color("#000"); // blanks it out
                for (var i=0; i< pixel_list.length; i++) {
                    if (++pixel_list[i] >= strip.length) {
                        pixel_list[i] = 0;
                        if (++current_colors[i] >= colors.length) current_colors[i] = 0;
                    }
                    strip.pixel(pixel_list[i]).color(colors[current_colors[i]]);
                }

                strip.show();
            }, 1000/fps);
            break;
        case "rainbow":
            var showColor;
            var cwi = 0; // colour wheel index (current position on colour wheel)
            blinker = setInterval(function(){
                if (++cwi > 255) {
                    cwi = 0;
                }

                for(var i = 0; i < strip.length; i++) {
                    showColor = colorWheel( ( cwi+i ) & 255 );
                    strip.pixel( i ).color( showColor );
                }
                strip.show();
            }, 1000/fps);
            break;
        default:
            strip.colour(currentAction.colour); // sets strip to a blue-green color using a named colour
            strip.show();

            break;
        
    }
}

pixel = require("node-pixel");
five = require("johnny-five");

var board = new five.Board();
var strip = null;

board.on("ready", function() {

    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        strips: [ {pin: 6, length: 8}, {pin: 8, length: 8},  {pin: 10, length: 8}, ],
       // gamma: 2.8, // set to a gamma that works nicely for WS2812
    });

    strip.on("ready", function() {
        console.log("debug","board and strip ready.")
        //startAction(config.actions[0]);
        //dynamicRainbow(fps);
    });
});

router.get('/on', function(req, res) { 

    if(!strip)res.json({ message: "check it's connected" }); 
    //default action
    var index = 0;
    //if passed as query strong parameter then use
    if(req.query.id)index = req.query.id;
    //validate index is in range
    if(index>config.actions.length-1)
    {
        res.json({ message: index +' not found.' }); 
    }else{
        startAction(config.actions[index]);
        res.json({ message: 'action started.' ,data:{id:index}}); 
    }
});

router.get('/custom', function(req, res) {  
    //as is demo don't validate input just execute
    startAction(req.query);
    res.json({ message: 'custom action started.' , data:req.query}); 
});

router.get('/off', function(req, res) {  
    stopAction();
    res.json({ message: 'off' }); 
});

app.use('/api', router);
var port = 3000;
app.listen(port);
console.log('Magic happens on port ' + port);


// Input a value 0 to 255 to get a color value.
// The colors are a transition r - g - b - back to r.
function colorWheel( WheelPos ){
    var r,g,b;
    WheelPos = 255 - WheelPos;

    if ( WheelPos < 85 ) {
        r = 255 - WheelPos * 3;
        g = 0;
        b = WheelPos * 3;
    } else if (WheelPos < 170) {
        WheelPos -= 85;
        r = 0;
        g = WheelPos * 3;
        b = 255 - WheelPos * 3;
    } else {
        WheelPos -= 170;
        r = WheelPos * 3;
        g = 255 - WheelPos * 3;
        b = 0;
    }
    // returns a string with the rgb value to be used as the parameter
    return "rgb(" + r +"," + g + "," + b + ")";
}