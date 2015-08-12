/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('builder'); // -> 'a thing'
 */
 
var utils = require('utils');

var builder = {
    roleName: 'builder',
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