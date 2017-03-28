// Import the module. 
var Omx = require('node-omxplayer');
 
var errorEvnt = function(err){
    console.log('error',err)
}

// Create an instance of the player with the source. 
var player = Omx('./sounds/crows.mp3');
 player.on('error', errorEvnt);