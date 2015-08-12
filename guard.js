/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('builder'); // -> 'a thing'
 */
var guard = {
    roleName: 'guard',
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
    	var targets = creep.room.find(FIND_HOSTILE_CREEPS);
    	if(targets.length) {
    		creep.moveTo(targets[0]);
    		creep.attack(targets[0]);
    	}
    }
};
 
module.exports = guard;