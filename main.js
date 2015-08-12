/*
* Main tick here
*/

console.log("tick");

var harvester = require('harvester');
var builder = require('builder');
var guard = require('guard');
var spawn = require('spawn');
var initializer = require('init');

console.log(Memory.initialized);
if(!Memory.initialized) {
    initializer();
}

Spawn.prototype.createUnitOfType = function(unitType) {
    return this.createCreep(unitType.getBodyParts(), unitType.getUnitName(), unitType.getMemory());
};

for(var spawn_name in Game.spawns) {
    var spawn_object = Game.spawns[spawn_name];
    spawn(spawn_object);
}

for(var name in Game.creeps) {
	var creep = Game.creeps[name];

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