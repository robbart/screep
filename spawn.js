/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn'); // -> 'a thing'
 */
 
var harvester = require('harvester');
 
module.exports = function (spawn) { 
    
    if(spawn.spawning) {
        return;
    }

	if(spawn.energy > harvester.getCost()) {
	    spawn.createUnitOfType(harvester);
    }
    
}
 
 