/*
* Main tick here
*/

var harvester = require('harvester');
var builder = require('builder');
var guard = require('guard');
var spawn = require('spawn');
var utils = require('utils');

var staticInitializer = require('staticInit');
staticInitializer();

if(!Memory.initialized) {
    var initializer = require('init');
    initializer();
}

for(var roomName in Game.rooms) {
    
    var room = Game.rooms[roomName];
    room.initStats();
    
    var spawnsInRoom = room.find(FIND_MY_SPAWNS);
    
    var spawnIndex = 0;
    var spawnsCount = spawnsInRoom.length;
    for(spawnIndex = 0; spawnIndex < spawnsCount; spawnIndex++) {
        var spawn_object = spawnsInRoom[spawnIndex];
        spawn(spawn_object);
    }
    
    var creepsInRoom = room.find(FIND_MY_CREEPS);
    var creepIndex = 0;
    var creepsCount = creepsInRoom.length;
    for(creepIndex = 0; creepIndex < creepsCount; creepIndex++) {
    	var creep = creepsInRoom[creepIndex];
    	
    	if(creep.fatigue > 0) {
    	    creep.say("fatigue:"+creep.fatigue);
    	}
    	
    	if(creep.hits <= 0) {
    	    creep.suicide();
    	    return;
    	}
    
    	if(creep.memory.role == 'harvester') {
    		harvester.run(creep);
    	}
    
    	if(creep.memory.role == 'builder') {
    	    builder.run(creep);
    	}
    	
    	if(creep.memory.role == 'guard') {
        	guard.run(creep);
        }
    }
}