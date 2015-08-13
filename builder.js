/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('builder'); // -> 'a thing'
 */
 
var utils = require('utils');
var BuilderState = require('builderState');
var harvester = require('harvester');

var builder = {
    roleName: 'builder',
    getBodyParts: function(){
        return [WORK, CARRY, MOVE, MOVE];
    },
    getCost: function(){
        return utils.getBodyPartsCost(this.getBodyParts());
    },
    getUnitName: function(){
        return this.roleName;
    },
    getMemory: function(){
        return {
            'role': this.roleName,
            'state': BuilderState.HARVEST
        };
    },
    run: function (creep) { 
        if(creep.memory.state == BuilderState.HARVEST) {
            
            // If not enough harvesters, stand and wait
            if(!creep.room.memory.harvestersFull) {
                return;
            }
            
            var target = Game.spawns.Spawn1;
            creep.moveTo(target);
            target.transferEnergy(creep);
            if(creep.carry.energy >= creep.carryCapacity) {
                creep.memory.state = BuilderState.TRANSFER;
            }
            
        } else if(creep.memory.state == BuilderState.TRANSFER) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                creep.moveTo(targets[0]);
                creep.build(targets[0]);
                if(creep.carry.energy <= 0) {
                    creep.memory.state = BuilderState.HARVEST;
                }
            } else {
                // After all construction sites are finished, transform itself to a normal harvester
                creep.memory = harvester.getMemory();
            }
        }
    }
};
 
module.exports = builder;