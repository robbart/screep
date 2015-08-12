/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('strategy'); // -> 'a thing'
 */
 
var harvester = require('harvester');
var guard = require('guard');
var builder = require('builder');
 
module.exports = {
    getCurrentSpawnTarget: function(spawn){
        
        var targets = spawn.room.find(FIND_HOSTILE_CREEPS);
    	if(targets.length > 0 && Memory.unitCount['guard'] < targets.length) {
    		return guard;
    	}
    	
    	if(Memory.unitCount['harvester'] > 3) {
    	    return builder;
    	}
    	
        return harvester;
    },
};