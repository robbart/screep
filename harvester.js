/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester'); // -> 'a thing'
 */
 
var harvester = {
    roleName: 'harvester',
    getBodyParts: function(){
        return [WORK, CARRY, MOVE];
    },
    getCost: function(){
        var costFunc = require("utils").getBodyPartCost;
        var parts = this.getBodyParts();
        var cost = 0;
        var partsIndex = 0;
        var partsCount = parts.length;
        for(partsIndex = 0; partsIndex< partsCount; partsIndex++) {
            cost += costFunc(parts[partsIndex]);
        }
        return cost;
    },
    getUnitName: function(){
        Memory.unitID++;
        return this.roleName + Memory.unitID.toString();
    },
    getMemory: function(){
        return {
            'role': this.roleName
        };
    },
    run: function (creep) { 
    	if(creep.carry.energy < creep.carryCapacity) {
    		var sources = creep.room.find(FIND_SOURCES);
    		creep.moveTo(sources[0]);
    		creep.harvest(sources[0]);
    	}
    	else {
    		creep.moveTo(Game.spawns.Spawn1);
    		creep.transferEnergy(Game.spawns.Spawn1)
    	}
    }
};
 
module.exports = harvester;