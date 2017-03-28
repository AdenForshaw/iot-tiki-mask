
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

console.log('info','OS platform detected as ',os.platform());

router.get('/action/start', function(req, res) { 

console.log("api",'action/start',req.query);

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

router.get('/action/custom', function(req, res) {  
    //as is demo don't validate input just execute
    startAction(req.query);
    res.json({ message: 'custom action started.' , data:req.query}); 
});

router.get('/action/stop', function(req, res) {  
    stopAction();
    res.json({ message: 'off' }); 
});
app.use('/api', router);
app.listen(8090);

/*
console.log('Magic happens on port ' + port);
*/
var currentAction;
var ledLoopTimer;

function startAction(action)
{
    console.log("method",'startAction',action);
    //validate action
    
    // - if no duration the default to 300
    // - default colour?
    
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

function playSound(fileName)
{
     //remember to add attribution to http://soundbible.com/royalty-free-sounds-3.html
    
    if(os.platform()=='linux')
    {
        // Create an instance of the player with the source. 
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
    strip.colour(currentAction.colour); // sets strip to a blue-green color using a named colour
    strip.show();
}

function loopLEDs()
{
   
    //Cylon / Knight rider
    //led shuttling left to right across both eyes as one strip. no mouth.

    //Blink

    //On

    //Glow (just a slow blink?)
}

function stopAction()
{
    //stop audio
    //player.stop();
    //reset leds
    resetLEDs();
    //clear timers
    
}

function resetLEDs()
{
    strip.off();
}

function onActionTimeout()
{
    stopAction();
}

pixel = require("node-pixel");
five = require("johnny-five");

var board = new five.Board();
var strip = null;

board.on("ready", function() {

    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        strips: [ {pin: 6, length: 8}, {pin: 8, length: 8},  {pin: 10, length: 8}, ], // this is preferred form for definition
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