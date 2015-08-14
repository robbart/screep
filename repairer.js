
var utils = require('utils');
var RepairerState = require('repairerState');
var harvester = require('harvester');
var config = require('config');

var repairer = {
    roleName: 'repairer',
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
            'state': RepairerState.HARVEST_FROM_SPAWN,
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
                creep.memory.state = RepairerState.HARVEST_FROM_SPAWN;
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
        creep.memory.state = RepairerState.HARVEST_FROM_EXTENSION;
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
        
        creep.memory.state = RepairerState.HARVEST_FROM_RESOURCE;
        creep.memory.target = resourcePointID;
        return resourcePointID;
    },
    findRepairTarget: function(creep){
        var roomStructuresNeedsRepair = [];
        var roomStructures = creep.room.find(FIND_STRUCTURES, {filter:function(st){
            return st.structureType == 'road' || st.my;
        }});
        var roomStructureIndex;
        var roomStructuresCount = roomStructures.length;
        for(roomStructureIndex = 0; roomStructureIndex < roomStructuresCount; roomStructureIndex++) {
            var roomStructure = roomStructures[roomStructureIndex];
            if(roomStructure.hits < roomStructure.hitsMax) {
                roomStructuresNeedsRepair.push({
                    structure: roomStructure,
                    priority: config.getRepairPriority(roomStructure.structureType, roomStructure.hits, roomStructure.hitsMax, creep.pos.x - roomStructure.pos.x, creep.pos.y - roomStructure.pos.y)
                });
            }
        }
        
        if(roomStructuresNeedsRepair.length <= 0) {
            return null;
        }
        
        roomStructuresNeedsRepair.sort(function(stPairA, stPairB){
            return stPairA.priority - stPairB.priority;
        });
        
        creep.memory.state = RepairerState.REPAIR;
        creep.memory.target = roomStructuresNeedsRepair[0].structure.id;
        
        return creep.memory.target;
    },
    run: function (creep) { 
        if(creep.memory.state == RepairerState.REPAIR) {
            
            // Go repair!
            var targetID = creep.memory.target;
            if(!targetID || targetID.length <= 0) {
                if(!this.findRepairTarget(creep)) {
                    // Cannot find new target to repair. Transform to harvester.
                    creep.memory = harvester.getMemory();
                }
            }
            
            var target = Game.getObjectById(targetID);
            if(!target) {
                return;
            }
            
            if(creep.carry.energy <= 0) {
                this.findHarvestTarget(creep);
                return;
            }
            
            if(target.hits >= target.hitsMax) {
                if(!this.findRepairTarget(creep)) {
                    creep.memory = harvester.getMemory();
                }
                return;
            }
            
            creep.moveTo(target);
            if(0 == creep.repair(target)) {
                creep.say("repair");
                this.findRepairTarget(creep);
            }
            
        } else {
            
            var target;
            
            if(creep.memory.state == RepairerState.HARVEST_FROM_SPAWN) {
            
                target = Game.getObjectById(creep.memory.target);
                if(!target) {
                    this.findHarvestTarget(creep);
                    return;
                }
                
                creep.moveTo(target);
                target.transferEnergy(creep);
                
                if(creep.carry.energy >= creep.carryCapacity) {
                    var repairTargetID = this.findRepairTarget(creep);
                    return;
                }
                
                if(target.energy <= config.MinEnergyBuilderGetFromSpawn) {
                    this.findHarvestTarget(creep);
                }
                
            } else if(creep.memory.state == RepairerState.HARVEST_FROM_EXTENSION) {
                
                target = Game.getObjectById(creep.memory.target);
                if(!target) {
                    this.findHarvestTarget(creep);
                    return;
                }
                
                creep.moveTo(target);
                target.transferEnergy(creep);
                
                if(creep.carry.energy >= creep.carryCapacity) {
                    this.findRepairTarget(creep);
                    return;
                }
                
                if(target.energy <= config.MinEnergyBuilderGetFromExtension) {
                    this.findHarvestTarget(creep);
                }
                
            } else if(creep.memory.state == RepairerState.HARVEST_FROM_RESOURCE) {
                var targetSource = Game.getObjectById(creep.memory.target);
                if(!targetSource) {
                    this.findHarvestTarget(creep);
                    return;
                }
                
                creep.moveTo(targetSource);
                creep.harvest(targetSource);
                if(creep.carry.energy >= creep.carryCapacity) {
                    this.findRepairTarget(creep);
                    return;
                }
            }
        }
    }
};
 
module.exports = repairer;