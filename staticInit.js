/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('staticInit'); // -> 'a thing'
 */
 
 /*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('init'); // -> 'a thing'
 */
 
var utils = require('utils');
var config = require('config');
 
module.exports = function () { 
    
    Spawn.prototype.createUnitOfType = function(unitType, nameSuffix, maxEnergy) {
        if(!nameSuffix) nameSuffix = "";
        return this.createCreep(unitType.getBodyParts(maxEnergy), unitType.getUnitName() + nameSuffix, unitType.getMemory());
    };
    
    Spawn.prototype.getEnergyTotal = function(){
        var extensionsTotal = 0;
        var roomExtensions = this.room.find(FIND_MY_STRUCTURES, {filter:utils.isStructure(STRUCTURE_EXTENSION)});
        var roomExtensionIndex;
        var roomExtensionsCount = roomExtensions.length;
        for(roomExtensionIndex = 0; roomExtensionIndex < roomExtensionsCount; roomExtensionIndex++) {
            extensionsTotal += roomExtensions[roomExtensionIndex].energy;
        }
        return extensionsTotal + this.energy;
    };
    
    Spawn.prototype.getEnergyCapacityTotal = function(){
        var extensionsTotal = 0;
        var roomExtensions = this.room.find(FIND_MY_STRUCTURES, {filter:utils.isStructure(STRUCTURE_EXTENSION)});
        var roomExtensionIndex;
        var roomExtensionsCount = roomExtensions.length;
        for(roomExtensionIndex = 0; roomExtensionIndex < roomExtensionsCount; roomExtensionIndex++) {
            extensionsTotal += roomExtensions[roomExtensionIndex].energyCapacity;
        }
        return extensionsTotal + this.energyCapacity;
    };
    
    Room.prototype.initStats = function() {
        
        var room = this;
        var harvesters = room.find(FIND_MY_CREEPS, {filter: utils.isOfUnitType('harvester')});
        var guards = room.find(FIND_MY_CREEPS, {filter: utils.isOfUnitType('guard')});
        var builders = room.find(FIND_MY_CREEPS, {filter: utils.isOfUnitType('builder')});
        var repairers = room.find(FIND_MY_CREEPS, {filter: utils.isOfUnitType('repairer')});
        var roomStructures = room.find(FIND_STRUCTURES, {filter: function(st){
            return st.my || st.structureType == STRUCTURE_ROAD;
        }});
        var resourcePoints = room.find(FIND_SOURCES_ACTIVE);
        
        // Collect room stats
        room.memory.unitCount = {
            'harvester': harvesters.length,
            'guard': guards.length,
            'builder': builders.length,
            'repairer': repairers.length,
        };
        
        // Collect resource point stats
        var resourceTargetedStat = {};
        
        var resourcePointIndex;
        var resourcePointsCount = resourcePoints.length;
        for(resourcePointIndex = 0; resourcePointIndex < resourcePointsCount; resourcePointIndex++) {
            resourceTargetedStat[resourcePoints[resourcePointIndex].id] = [];
        }
        
        var harvesterIndex;
        var harvestersCount = harvesters.length;
        for(harvesterIndex = 0; harvesterIndex < harvestersCount; harvesterIndex++) {
            var harvesterCreep = harvesters[harvesterIndex];
            if(harvesterCreep.memory.target && harvesterCreep.memory.target.length > 0 && harvesterCreep.memory.target in resourceTargetedStat) {
                resourceTargetedStat[harvesterCreep.memory.target].push(harvesterCreep);
            }
        }
        room.memory.resourcePointsCount = resourcePoints.length;
        room.memory.resourceTargeted = resourceTargetedStat;
        var maxResourceWorkersCount = resourcePointsCount * config.MaxHarvestersCountPerResourcePoint;
        room.memory.harvestersFull = harvestersCount >= maxResourceWorkersCount;
        
        room.memory.repairersNeeded = 0;
        var roomStructureIndex;
        var roomStructuresCount = roomStructures.length;
        for(roomStructureIndex = 0; roomStructureIndex < roomStructuresCount; roomStructureIndex++) {
            var roomStructure = roomStructures[roomStructureIndex];
            room.memory.repairersNeeded += config.getRepairerRatioForStructureType(roomStructure.structureType);
        }
        room.memory.repairersNeeded = parseInt(room.memory.repairersNeeded);
        
    };
    
}