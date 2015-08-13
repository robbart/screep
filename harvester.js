/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester'); // -> 'a thing'
 */
 
var utils = require('utils');
var HarvesterState = require('harvesterState');
 
var harvester = {
    roleName: 'harvester',
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
            'target': '',
            'state': HarvesterState.HARVEST,
        };
    },
    run: function (creep) { 
        
        if(creep.memory.state == HarvesterState.HARVEST) {
            
            var targetSourceID = creep.memory.target;
            if(!targetSourceID || targetSourceID.length <= 0) {
                // Find a resource point which is being harvested by the least harvesters
                var minHarverstersCount = -1;
                var minHarvestersResourceID = '';
                for(var resourceID in creep.room.memory.resourceTargeted) {
                    var cnt = creep.room.memory.resourceTargeted[resourceID].length;
                    if(minHarverstersCount == -1 || cnt < minHarverstersCount) {
                        minHarverstersCount = cnt;
                        minHarvestersResourceID = resourceID;
                    }
                }
                creep.memory.target = minHarvestersResourceID;
                targetSourceID = minHarvestersResourceID;
                creep.room.memory.resourceTargeted[minHarvestersResourceID].push(creep);
            }
            
            var targetSource = Game.getObjectById(targetSourceID);
            if(targetSource) {
                creep.moveTo(targetSource);
                creep.harvest(targetSource);
            } else {
                creep.memory.target = '';
            }
            
            if(creep.carry.energy >= creep.carryCapacity) {
                
                // Remove from harvest flag array
                var arr = creep.room.memory.resourceTargeted[creep.memory.target];
                arr.splice(arr.indexOf(creep.id), 1);
                
                var targetSpawn = Game.spawns.Spawn1;
                if(targetSpawn.energy < targetSpawn.energyCapacity) {
                    creep.memory.state = HarvesterState.TRANSFER;
                    creep.memory.target = targetSpawn.id;
                } else {
                    creep.memory.state = HarvesterState.UPGRADE;
                    creep.memory.target = creep.room.controller.id;
                }
                
            } else {
                creep.memory.state = HarvesterState.HARVEST;
            }
        } else if(creep.memory.state == HarvesterState.TRANSFER) {
            var transferTarget = Game.getObjectById(creep.memory.target);
            if(!transferTarget) {
                return;
            }
            if(transferTarget.energy >= transferTarget.energyCapacity) {
                creep.memory.state = HarvesterState.UPGRADE;
                creep.memory.target = creep.room.controller.id;
            } else {
                creep.moveTo(transferTarget);
                creep.transferEnergy(transferTarget);
            }
            
            if(creep.carry.energy < creep.carryCapacity) {
                creep.memory.state = HarvesterState.HARVEST;
                creep.memory.target = '';
            }
        } else if(creep.memory.state == HarvesterState.UPGRADE) {
            var targetRoomController = Game.getObjectById(creep.memory.target);
            if(!targetRoomController) {
                return;
            }
            creep.moveTo(targetRoomController);
            creep.upgradeController(targetRoomController);
            if(creep.carry.energy <= 0) {
                creep.memory.state = HarvesterState.HARVEST;
                creep.memory.target = '';
            }
        }

    }
};
 
module.exports = harvester;