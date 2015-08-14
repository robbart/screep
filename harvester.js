/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('harvester'); // -> 'a thing'
 */
 
var utils = require('utils');
var HarvesterState = require('harvesterState');
var config = require('config');
 
var harvester = {
    roleName: 'harvester',
    getBodyParts: function(maxEnergy){
        var levels = config.unitConfig[this.roleName].levels;
        var levelIndex = levels.length - 1;
        for(levelIndex = levels.length - 1; levelIndex >= 0; levelIndex--) {
            var levelConfig = levels[levelIndex];
            var levelCost = utils.getBodyPartsCost(levelConfig.parts);
            if(levelCost <= maxEnergy) {
                return levelConfig.parts;
            }
        }
        return levels[0].parts;
    },
    getCost: function(maxEnergy){
        return utils.getBodyPartsCost(this.getBodyParts(maxEnergy));
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
    findTransferTarget: function(creep){
        // Find one Spawn that is not full
        var targetSpawn = this.findTransferTargetSpawn(creep)
        if(targetSpawn) {
            return targetSpawn;
        }
        
        // Find one Extension that is not full
        var targetExtension = this.findTransferTargetExtension(creep);
        if(targetExtension) {
            return targetExtension;
        }
        
        // If all spawns and extensions are full, then send energy to RoomController
        var targetRoomController = this.findTransferTargetRoomController(creep);
        if(targetRoomController) {
            return targetRoomController;
        }
        
        return null;
    },
    findTransferTargetSpawn: function(creep){
        // Find one Spawn that is not full
        var roomSpawns = creep.room.find(FIND_MY_SPAWNS);
        var roomSpawnIndex;
        var roomSpawnsCount = roomSpawns.length;
        for(roomSpawnIndex = 0; roomSpawnIndex < roomSpawnsCount; roomSpawnIndex++) {
            var targetSpawn = roomSpawns[roomSpawnIndex];
            if(targetSpawn.energy < targetSpawn.energyCapacity) {
                creep.memory.state = HarvesterState.TRANSFER;
                creep.memory.target = targetSpawn.id;
                return targetSpawn.id;
            }
        }
        return null;
    },
    findTransferTargetExtension: function(creep){
        var roomExtensions = creep.room.find(FIND_MY_STRUCTURES, {filter:utils.isStructure(STRUCTURE_EXTENSION)});
        var roomExtensionIndex;
        var roomExtensionsCount = roomExtensions.length;
        var availableExtensions = [];
        var roomExtension;
        for(roomExtensionIndex = 0; roomExtensionIndex < roomExtensionsCount; roomExtensionIndex++) {
            roomExtension = roomExtensions[roomExtensionIndex];
            if(roomExtension.energy < roomExtension.energyCapacity) {
                availableExtensions.push(roomExtension);
            }
        }
        
        if(availableExtensions.length <= 0) {
            return null;
        }
        
        roomExtension = availableExtensions[parseInt(Math.random() * availableExtensions.length)];
        creep.memory.state = HarvesterState.TRANSFER;
        creep.memory.target = roomExtension.id;
        return roomExtension.id;
    },
    findTransferTargetRoomController: function(creep){
        creep.memory.state = HarvesterState.UPGRADE;
        creep.memory.target = creep.room.controller.id;
        return creep.room.controller.id;
    },
    findResourcePoint: function(creep){
        var minHarverstersCount = -1;
        var minHarvestersResourceID = '';
        for(var resourceID in creep.room.memory.resourceTargeted) {
            var cnt = creep.room.memory.resourceTargeted[resourceID].length;
            if(minHarverstersCount == -1 || cnt < minHarverstersCount) {
                minHarverstersCount = cnt;
                minHarvestersResourceID = resourceID;
            }
        }
        return minHarvestersResourceID;
    },
    run: function (creep) { 
        
        if(creep.memory.state == HarvesterState.HARVEST) {
            
            var targetSourceID = creep.memory.target;
            if(!targetSourceID || targetSourceID.length <= 0) {
                // Find a resource point which is being harvested by the least harvesters
                var minHarvestersResourceID = this.findResourcePoint(creep);
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
                
                // Find a transfer target
                this.findTransferTarget(creep);
                
            } else {
                creep.memory.state = HarvesterState.HARVEST;
            }
        } else if(creep.memory.state == HarvesterState.TRANSFER) {
            var transferTarget = Game.getObjectById(creep.memory.target);
            if(!transferTarget) {
                return;
            }
            
            if(transferTarget.energy >= transferTarget.energyCapacity) {
                this.findTransferTarget(creep);
                return;
            } else {
                creep.moveTo(transferTarget);
                creep.transferEnergy(transferTarget);
            }
            
            if(creep.carry.energy > 0) {
                var newTransferTarget = this.findTransferTarget(creep);
                if(newTransferTarget) {
                    return;
                }
            }
            
            creep.memory.state = HarvesterState.HARVEST;
            creep.memory.target = '';
            
        } else if(creep.memory.state == HarvesterState.UPGRADE) {
            
            // Try to find transfer target
            this.findTransferTarget(creep);
            
            if(creep.memory.state != HarvesterState.UPGRADE)
                return;
            
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