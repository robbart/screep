/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('builder'); // -> 'a thing'
 */

var builder = {
    roleName: 'builder',
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
    	if(creep.carry.energy == 0) {
			creep.moveTo(Game.spawns.Spawn1);
			Game.spawns.Spawn1.transferEnergy(creep);
		}
		else {
			var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			if(targets.length) {
				creep.moveTo(targets[0]);
				creep.build(targets[0]);
			}
		}
    }
};
 
module.exports = builder;