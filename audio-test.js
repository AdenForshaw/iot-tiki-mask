// Import the module. 
var Omx = require('node-omxplayer');
 var os = require('os');
var errorEvnt = function(err){
    console.log('error',err)
}

console.log(os.platform());

// Create an instance of the player with the source. 
var player = Omx('./sounds/crows.mp3');
 player.on('error', errorEvnt);