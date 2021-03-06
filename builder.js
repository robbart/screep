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
var repairer = require('repairer');
var config = require('config');

var builder = {
    roleName: 'builder',
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
            'state': BuilderState.HARVEST_FROM_SPAWN,
            'target': '',
        };
    },
    findHarvestTarget: function(creep){
        
        // If not enough harvesters, go mining itself
        if(!creep.room.memory.harvestersFull) {
            return this.findHarvestTargetResourcePoint(creep);
        }
        
        // Find one Spawn that has decent amount of energy
        var targetSpawn = this.findHarvestTargetSpawn(creep)
        if(targetSpawn) {
            return targetSpawn;
        }
        
        // Find one Extension that has energy
        var targetExtension = this.findHarvestTargetExtension(creep);
        if(targetExtension) {
            return targetExtension;
        }
        
        // Harvest from ResourcePoint directly
        var targetResourcePoint = this.findHarvestTargetResourcePoint(creep);
        if(targetResourcePoint) {
            return targetResourcePoint;
        }
        
        return null;
    },
    findHarvestTargetSpawn: function(creep){
        var roomSpawns = creep.room.find(FIND_MY_SPAWNS);
        var roomSpawnIndex;
        var roomSpawnsCount = roomSpawns.length;
        for(roomSpawnIndex = 0; roomSpawnIndex < roomSpawnsCount; roomSpawnIndex++) {
            var targetSpawn = roomSpawns[roomSpawnIndex];
            if(targetSpawn.energy > config.MinEnergyBuilderGetFromSpawn) {
                creep.memory.state = BuilderState.HARVEST_FROM_SPAWN;
                creep.memory.target = targetSpawn.id;
                return targetSpawn.id;
            }
        }
        return null;
    },
    findHarvestTargetExtension: function(creep){
        var availableExtensions = [];
        var roomExtensions = creep.room.find(FIND_MY_STRUCTURES, {filter:utils.isStructure(STRUCTURE_EXTENSION)});
        var roomExtensionIndex;
        var roomExtensionsCount = roomExtensions.length;
        var roomExtension;
        for(roomExtensionIndex = 0; roomExtensionIndex < roomExtensionsCount; roomExtensionIndex++) {
            roomExtension = roomExtensions[roomExtensionIndex];
            if(roomExtension.energy > config.MinEnergyBuilderGetFromExtension) {
                availableExtensions.push(roomExtension);
                
            }
        }
        if(!availableExtensions || availableExtensions.length <= 0)
            return null;
        
        roomExtension = availableExtensions[parseInt(Math.random() * availableExtensions.length)];
        creep.memory.state = BuilderState.HARVEST_FROM_EXTENSION;
        creep.memory.target = roomExtension.id;
        return roomExtension.id;
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
    findHarvestTargetResourcePoint: function(creep){
        var resourcePointID = this.findResourcePoint(creep);
        if(!resourcePointID || resourcePointID.length <= 0) {
            return null;
        }
        
        var resourcePoint = Game.getObjectById(resourcePointID);
        if(!resourcePoint) {
            return null;
        }
        
        creep.memory.state = BuilderState.HARVEST_FROM_RESOURCE;
        creep.memory.target = resourcePointID;
        return resourcePointID;
    },
    run: function (creep) { 
        if(creep.memory.state == BuilderState.TRANSFER) {
            
            // Find the first construction site and go go go
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                var buildTarget = targets[0];
                creep.moveTo(buildTarget);
                var buildScheduled = false;
                if( 0 == creep.build(buildTarget)) {
                    buildScheduled = true;
                    creep.say("work");
                }
                
                if(creep.carry.energy <= 0) {
                    this.findHarvestTarget(creep);
                }
                
                if(buildScheduled && (buildTarget.structureType == STRUCTURE_RAMPART || buildTarget.structureType == STRUCTURE_WALL)) {
                    creep.memory.state = BuilderState.REPAIR_WALL;
                    creep.memory.target =  buildTarget.pos.x + "_" +  buildTarget.pos.y;
                }
                
            } else {
                // After all construction sites are finished, transform itself to a normal repairer
                creep.memory = repairer.getMemory();
            }
            
        } else if(creep.memory.state == BuilderState.REPAIR_WALL) {
            
            var target = creep.memory.target;
            var targetPos = target.split("_");
            if(targetPos.length != 2) {
                creep.memory.state = BuilderState.TRANSFER;
                return;
            }
            
            var structuresAtTargetPos = creep.room.lookForAt('structure', Number(targetPos[0]), Number(targetPos[1]));
            var repairTarget = structuresAtTargetPos[0];
            if(!repairTarget) {
                creep.say("404");
                creep.memory.state = BuilderState.TRANSFER;
                return;
            }
            
            creep.moveTo(repairTarget);
            if(0 == creep.repair(repairTarget)) {
                creep.say("repair");
            }
            
            if(creep.carry.energy <= 0) {
                this.findHarvestTarget(creep);
            }
            
            if(repairTarget.hits >= config.RampartHitsMax) {
                creep.memory.state = BuilderState.TRANSFER;
                return;
            }
            
        } else {
            
            var target;
            
            if(creep.memory.state == BuilderState.HARVEST_FROM_SPAWN) {
            
                target = Game.getObjectById(creep.memory.target);
                if(!target) {
                    this.findHarvestTarget(creep);
                    return;
                }
                creep.moveTo(target);
                target.transferEnergy(creep);
                
                if(creep.carry.energy >= creep.carryCapacity) {
                    creep.memory.state = BuilderState.TRANSFER;
                }
                
                if(target.energy <= config.MinEnergyBuilderGetFromSpawn) {
                    this.findHarvestTarget(creep);
                }
                
            } else if(creep.memory.state == BuilderState.HARVEST_FROM_EXTENSION) {
                
                target = Game.getObjectById(creep.memory.target);
                if(!target) {
                    this.findHarvestTarget(creep);
                    return;
                }
                
                creep.moveTo(target);
                target.transferEnergy(creep);
                
                if(creep.carry.energy >= creep.carryCapacity) {
                    creep.memory.state = BuilderState.TRANSFER;
                }
                
                if(target.energy <= config.MinEnergyBuilderGetFromExtension) {
                    this.findHarvestTarget(creep);
                }
                
            } else if(creep.memory.state == BuilderState.HARVEST_FROM_RESOURCE) {
                var targetSource = Game.getObjectById(creep.memory.target);
                if(!targetSource) {
                    this.findHarvestTarget(creep);
                    return;
                }
                
                creep.moveTo(targetSource);
                creep.harvest(targetSource);
                if(creep.carry.energy >= creep.carryCapacity) {
                    creep.memory.state = BuilderState.TRANSFER;
                }
            }
        }
    }
};
 
module.exports = builder;