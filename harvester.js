/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester'); // -> 'a thing'
 */
 
var utils = require('utils');
 
var harvester = {
    roleName: 'harvester',
    getBodyParts: function(){
        return [WORK, CARRY, MOVE];
    },
    getCost: function(){
        return utils.getBodyPartsCost(this.getBodyParts());
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